// Live Transformed Countdown — core logic
(() => {
  const KEYS = {
    birthdate: 'ltc.birthdate',
    lifespan: 'ltc.lifespan',
    slogan: 'ltc.slogan',
    tts: 'ltc.tts',
    quoteInterval: 'ltc.quoteInterval',
    lovedOnes: 'ltc.lovedOnes'
  };

  // Elements
  const elCountdown = document.getElementById('countdown');
  const elPercent   = document.getElementById('percentage-lived');
  const elQuote     = document.getElementById('quote');
  const elLocalTime = document.getElementById('local-time');
  const elSloganDisp= document.getElementById('slogan-display');
  const elSettings  = document.getElementById('settings-dialog');
  const elLovedDlg  = document.getElementById('loved-one-dialog');
  const elLovedList = document.getElementById('loved-ones-list');

  // Settings form elements
  const openSettingsBtn = document.getElementById('open-settings');
  const birthInput  = document.getElementById('user-birthdate');
  const lifeInput   = document.getElementById('lifespan');
  const sloganInput = document.getElementById('slogan-input');
  const ttsInput    = document.getElementById('tts-enabled');
  const qIntInput   = document.getElementById('quote-interval');
  const saveSettings= document.getElementById('save-settings');

  // Loved one form
  const loForm      = document.getElementById('loved-one-form');
  const loTitle     = document.getElementById('loved-one-title');
  const loIndex     = document.getElementById('loved-one-index');
  const loName      = document.getElementById('lo-name');
  const loBirth     = document.getElementById('lo-birthdate');
  const loPhoto     = document.getElementById('lo-photo');
  const addLovedBtn = document.getElementById('add-loved-one');

  // Local state
  let lovedOnes = loadLovedOnes();
  let quoteIdx = 0;
  let quoteTimer = null;

  function registerSW(){
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js');
      });
    }
  }

  function tickLocalClock(){
    elLocalTime.textContent = new Date().toLocaleTimeString();
  }
  setInterval(tickLocalClock, 1000); tickLocalClock();

  function load(key, fallback){
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  }
  function save(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  function loadLovedOnes(){
    return load(KEYS.lovedOnes, []);
  }
  function saveLovedOnes(){
    save(KEYS.lovedOnes, lovedOnes);
    renderLovedOnes();
  }

  // Defaults if not set
  const defaultBirth = load(KEYS.birthdate, null);
  const defaultLifeYears = load(KEYS.lifespan, 80);
  const defaultSlogan = load(KEYS.slogan, 'live like it matters');
  const defaultTTS = load(KEYS.tts, false);
  const defaultQInt = load(KEYS.quoteInterval, 30);

  // Seed UI
  if (defaultBirth) birthInput.value = defaultBirth;
  lifeInput.value = defaultLifeYears;
  sloganInput.value = defaultSlogan;
  ttsInput.checked = !!defaultTTS;
  qIntInput.value = defaultQInt;
  elSloganDisp.textContent = defaultSlogan;

  // Countdown calc
  function addYears(date, years){
    const d = new Date(date);
    d.setFullYear(d.getFullYear() + years);
    return d;
  }
  function formatCountdown(ms){
    if (ms < 0) return "00:00:00:00";
    const totalSec = Math.floor(ms / 1000);
    const days = Math.floor(totalSec / 86400);
    const hrs  = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const pad = n => String(n).padStart(2,'0');
    return `${days}:${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  function percentLived(birth, lifespanYears){
    const start = new Date(birth);
    const end   = addYears(start, lifespanYears);
    const now   = new Date();
    const total = end - start;
    const elapsed = Math.max(0, now - start);
    const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
    return { pct, end };
  }

  function updateCountdown(){
    const birth = load(KEYS.birthdate, null);
    const lifespan = load(KEYS.lifespan, 80);
    if (!birth){
      elCountdown.textContent = "Set your birthdate in settings";
      elPercent.textContent = "";
      return;
    }
    const start = new Date(birth);
    const end = addYears(start, lifespan);
    const now = new Date();
    const remaining = end - now;
    elCountdown.textContent = formatCountdown(remaining);
    const { pct } = percentLived(start, lifespan);
    elPercent.textContent = `${pct.toFixed(1)}% lived`;
  }
  setInterval(updateCountdown, 1000); updateCountdown();

  // Quotes rotation + TTS
  function speak(text){
    if (!load(KEYS.tts, false)) return;
    if (!('speechSynthesis' in window)) return;
    try{
      window.speechSynthesis.cancel();
      const ut = new SpeechSynthesisUtterance(text);
      ut.rate = 1; ut.pitch = 1;
      window.speechSynthesis.speak(ut);
    }catch(e){ /* no-op */ }
  }

  function setQuote(idx){
    const q = (window.LTC_QUOTES && window.LTC_QUOTES[idx % window.LTC_QUOTES.length]) || "";
    elQuote.style.opacity = 0;
    setTimeout(() => {
      elQuote.textContent = q;
      elQuote.style.opacity = 1;
      speak(q);
    }, 250);
  }

  function startQuoteRotation(){
    if (quoteTimer) clearInterval(quoteTimer);
    const intervalMs = Math.max(10000, (load(KEYS.quoteInterval, 30) * 1000) || 30000);
    setQuote(quoteIdx++);
    quoteTimer = setInterval(() => setQuote(quoteIdx++), intervalMs);
  }
  startQuoteRotation();

  // Loved ones
  function renderLovedOnes(){
    elLovedList.innerHTML = "";
    lovedOnes.slice(0,5).forEach((lo, i) => {
      const li = document.createElement('li');
      const img = document.createElement('img');
      img.className = 'lo-avatar';
      img.alt = '';
      img.src = lo.photo || '';
      const meta = document.createElement('div');
      meta.className = 'lo-meta';

      const daysLeft = calcDaysLeft(lo.birthdate, load(KEYS.lifespan, 80));
      meta.textContent = `${lo.name} — ${daysLeft} days left`;

      const actions = document.createElement('div');
      actions.className = 'lo-actions';
      const edit = document.createElement('button');
      edit.textContent = 'Edit';
      edit.addEventListener('click', () => openLovedOneEditor(i));
      const del = document.createElement('button');
      del.textContent = 'Remove';
      del.addEventListener('click', () => { lovedOnes.splice(i,1); saveLovedOnes(); });

      actions.append(edit, del);
      if (lo.photo) li.append(img);
      li.append(meta, actions);
      elLovedList.append(li);
    });
    addLovedBtn.style.display = lovedOnes.length >= 5 ? 'none' : 'inline-block';
  }

  function calcDaysLeft(birthdate, lifespanYears){
    const start = new Date(birthdate);
    const end = addYears(start, lifespanYears);
    const now = new Date();
    const diff = end - now;
    return Math.max(0, Math.ceil(diff / (1000*60*60*24)));
  }

  function openLovedOneEditor(index=null){
    loForm.reset();
    loIndex.value = index !== null ? String(index) : "";
    loTitle.textContent = index !== null ? "Edit Loved One" : "Add Loved One";
    if (index !== null){
      const lo = lovedOnes[index];
      loName.value = lo.name || "";
      if (lo.birthdate) loBirth.value = lo.birthdate;
    }
    elLovedDlg.showModal();
  }

  addLovedBtn.addEventListener('click', () => openLovedOneEditor(null));

  loForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const idx = loIndex.value === "" ? null : Number(loIndex.value);
    const name = loName.value.trim();
    const birth = loBirth.value;
    let photoData = null;
    const file = loPhoto.files && loPhoto.files[0];
    if (file){
      photoData = await fileToDataURL(file);
    }
    const newObj = { name, birthdate: birth, photo: photoData };
    if (idx === null){
      if (lovedOnes.length >= 5) return;
      lovedOnes.push(newObj);
    }else{
      lovedOnes[idx] = { ...lovedOnes[idx], ...newObj, photo: photoData || lovedOnes[idx].photo };
    }
    saveLovedOnes();
    elLovedDlg.close();
  });

  function fileToDataURL(file){
    return new Promise((resolve,reject)=>{
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  // Settings
  openSettingsBtn.addEventListener('click', () => {
    // load current values
    birthInput.value = load(KEYS.birthdate, birthInput.value || "");
    lifeInput.value = load(KEYS.lifespan, parseInt(lifeInput.value,10) || 80);
    sloganInput.value = load(KEYS.slogan, sloganInput.value || "");
    ttsInput.checked = !!load(KEYS.tts, false);
    qIntInput.value = load(KEYS.quoteInterval, parseInt(qIntInput.value,10) || 30);
    elSettings.showModal();
  });

  saveSettings.addEventListener('click', (e) => {
    e.preventDefault();
    const b = birthInput.value;
    if (b) save(KEYS.birthdate, b);
    const life = Math.max(1, Math.min(130, parseInt(lifeInput.value,10) || 80));
    save(KEYS.lifespan, life);

    const s = (sloganInput.value || "").trim();
    save(KEYS.slogan, s || "live like it matters");
    elSloganDisp.textContent = s || "live like it matters";

    const tts = !!ttsInput.checked;
    save(KEYS.tts, tts);

    const qi = Math.max(10, Math.min(600, parseInt(qIntInput.value,10) || 30));
    save(KEYS.quoteInterval, qi);
    startQuoteRotation();

    elSettings.close();
    updateCountdown();
    renderLovedOnes();
  });

  // Initial render
  renderLovedOnes();

  // Register SW
  registerSW();
})();
