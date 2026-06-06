# Accessibility and Privacy Compliance Guide
## WCAG 2.2 AA + COPPA 2025 for a Children's Math PWA

*Research completed June 2026. All regulatory citations current as of that date.*

---

## Part 1 — WCAG 2.2 AA for a Children's Educational Math PWA

### Why WCAG 2.2 Specifically Matters Here

WCAG 2.2 was published on 5 October 2023. It adds nine new success criteria to WCAG 2.1 and removes the notoriously difficult 4.1.1 Parsing criterion, leaving 87 criteria in total (30 at Level A, 20 at Level AA, 37 at Level AAA). The European Accessibility Act became enforceable on 28 June 2025, making WCAG 2.2 AA the operative standard for digital products sold or distributed in the EU. In the US it remains the benchmark for ADA Title III litigation. For a children's math app the new 2.2 criteria are not minor additions — they directly address the user populations most affected: users with motor impairments who rely on keyboards or switch access, users with low vision who need visible focus indicators, and young learners who may be distracted or disoriented by motion.

---

### The Nine WCAG 2.2 Criteria Relevant to a Math App

#### 1. SC 2.4.11 — Focus Not Obscured (Minimum) — Level AA

When a user interface component receives keyboard focus, that component must not be entirely hidden by author-created content such as a sticky header, modal overlay, or cookie banner. Partially obscured is acceptable under 2.4.11 (though it fails the stricter AAA version, 2.4.12). For a math app with a question panel and a persistent toolbar, ensure that tabbing to an answer button does not put the button behind the toolbar. The pass test is visual: tab to every interactive element and confirm at least some portion of the element is visible.

#### 2. SC 2.4.13 — Focus Appearance — Level AAA (strongly recommended)

Note the level: 2.4.13 is AAA, not AA. However, for a children's app where many users may have motor or visual impairments, targeting this criterion is standard best practice in education and government contexts. The requirement is a focus indicator that encloses the focused component with a minimum thickness of 2 CSS pixels and a contrast ratio of at least 3:1 between focused and unfocused states, and at least 3:1 against adjacent colours. The implication for a math app: the default browser focus ring is almost never sufficient. Implement a custom outline — a solid 3px ring in a colour that contrasts with both the button background and the page background (e.g., a mid-blue button needs a dark-ring and a light-ring option depending on context).

#### 3. SC 2.5.7 — Dragging Movements — Level AA

Every function that requires dragging (sorting fraction pieces, placing digits on a number line, drag-to-match activities) must have a single-pointer alternative — a tap, click, or button press that achieves the same result. The alternative does not have to be identical in appearance; it must merely be possible. For a number-line drag activity, providing tap-to-place or arrow-key movement fulfils this criterion. Dragging that is provided by the user agent (browser scroll) and not modified by the author is exempt.

#### 4. SC 2.5.8 — Target Size (Minimum) — Level AA

Interactive targets must be at least 24 by 24 CSS pixels. This refers to the hit area (the pointer target), not the visible icon. A 16 by 16 icon with 4 px padding on all sides passes. Exceptions: inline targets whose size is constrained by surrounding line-height, user-agent-controlled targets, and targets where spacing is sufficient (a 24 px diameter circle centred on each small target must not overlap any neighbouring target's circle). For a math app on a tablet this is a low bar — best practice for children is 44 by 44 CSS pixels (Apple HIG) or 48 dp (Material Design). Aim for 44 px minimum on all answer buttons, number pads, and navigation controls.

#### 5. SC 1.4.3 — Contrast (Minimum) — Level AA (pre-existing, critical for children)

Text must achieve 4.5:1 contrast ratio against its background; large text (18 pt / 24 px regular, or 14 pt / 18.66 px bold) needs 3:1. Children's apps frequently fail this by using pastel colour schemes. Every question text, answer label, instruction, feedback message, and UI label must pass. Test with the WebAIM Contrast Checker or the browser DevTools colour picker.

#### 6. SC 1.4.11 — Non-text Contrast — Level AA (pre-existing, critical for SVG math)

UI components and graphical objects (including interactive SVG elements such as fraction bars, geometry shapes, and graph axes) must achieve a 3:1 contrast ratio against adjacent colour(s). For a math app with SVG diagrams: the stroke/fill of a shape that conveys meaning must pass 3:1. An SVG fraction bar outlined in light grey on white fails. This also applies to form inputs: the visible border of a text-answer box must pass 3:1.

#### 7. SC 1.4.12 — Text Spacing — Level AA

Content must not lose functionality or readability when a user overrides text spacing to: line height of 1.5× font size, paragraph spacing of 2× font size, letter spacing of 0.12× font size, and word spacing of 0.16× font size. The test method is the W3C Text Spacing Bookmarklet or the Accessibility Insights Text Spacing feature. The most common failure is hardcoded pixel heights on containers that clip text when spacing expands. For math labels inside SVG, this criterion applies only to HTML text; SVG text elements are exempt from this specific criterion but must still be readable in practice.

#### 8. SC 2.1.1 — Keyboard and SC 2.1.2 — No Keyboard Trap — Level A

All functionality must be operable by keyboard alone (Tab, Shift+Tab, Enter, Space, arrow keys). SC 2.1.2 prohibits trapping keyboard focus inside a component with no way out except closing the browser. For a math app: every answer button, hint trigger, navigation control, and interactive SVG must be keyboard-reachable. No keyboard trap means that custom modal dialogs must expose a visible close mechanism reachable by keyboard (typically Escape key + a visible close button that is tabbable). Screen-reader carousels and drag-and-drop activities are especially prone to traps.

#### 9. SC 4.1.3 — Status Messages — Level AA

Status messages that convey success, error, progress, or updated information must be programmatically determinable without the component receiving focus, so that assistive technologies can announce them. Implementation: wrap answer-feedback messages ("Correct! Well done." / "Try again.") in a container with `role="status"` (for non-urgent, polite announcements) or `role="alert"` (for important errors requiring immediate attention). Both roles are ARIA live regions. Key rules: the live region element must exist in the DOM before the message is injected; setting `aria-atomic="true"` ensures the full message is read rather than just the changed fragment. Automated tools can confirm the presence of `role="status"` but cannot verify the message is timely or correct — manual screen-reader testing is required.

#### Bonus: SC 2.3.3 — Animation from Interactions — Level AAA (strongly recommended for children)

Technically AAA, but every children's app that uses bounce animations, confetti celebrations, or sliding transitions should implement this. Motion animation triggered by interaction must be disableable unless it is essential. The mechanism is the CSS `prefers-reduced-motion` media query: when the OS reduced-motion preference is set, all non-essential animations should be suppressed or replaced with instant state changes. Best practice: also provide an in-app "Reduce animations" toggle for users who cannot access OS settings. Children with vestibular disorders, ADHD, and sensory-processing differences benefit directly.

---

### ARIA for Interactive SVG Math

Interactive SVG elements in a math app (fraction models, number lines, geometry tools) require explicit ARIA treatment because SVG has inconsistent native accessibility semantics across browsers and screen readers.

For purely informational SVG (a diagram that illustrates a concept): add `role="img"` to the `<svg>` element, make `<title>` the first child element with a unique `id`, optionally add `<desc>` for longer descriptions, and wire `aria-labelledby` to reference both ids. Hide decorative SVGs entirely with `aria-hidden="true"`.

For interactive SVG (a draggable number line, a clickable fraction bar): each interactive region needs a focusable element (native `<button>` or `tabindex="0"` on a `<g>` or `<rect>` element), an accessible name via `aria-label` or `aria-labelledby`, and an appropriate ARIA role (`role="slider"`, `role="spinbutton"`, or `role="button"` as applicable). Keyboard events (Enter, Space, arrow keys) must be handled explicitly in JavaScript. Avoid relying solely on `pointer-events` for interaction. Test with NVDA + Firefox and VoiceOver + Safari, as SVG accessibility varies significantly between these pairings.

---

### How to Test WCAG 2.2 AA Compliance

**Automated (catches ~30–40% of issues)**

Run axe-core via the browser extension or integrated into the CI pipeline (axe-core underpins both Lighthouse and Microsoft Accessibility Insights). Run Google Lighthouse accessibility audit in Chrome DevTools (Lighthouse tab > Accessibility). Automated tools reliably catch: missing alt text, contrast failures, missing form labels, duplicate IDs, and missing ARIA roles. They cannot catch: focus-order logic errors, incorrect live-region behaviour, keyboard traps in custom widgets, or SVG accessible-name quality.

**Keyboard-only testing (manual)**

Unplug the mouse. Tab through every page, confirm: a visible focus indicator exists at every step; all interactive elements are reachable and activatable; no element traps focus; modal dialogs open and close correctly; custom widgets (sliders, drag items) have working keyboard alternatives.

**Screen-reader testing (manual)**

Test with at least two screen-reader/browser combinations: NVDA with Firefox (most common free Windows reader) and VoiceOver with Safari on iOS (dominant mobile reader for children's apps). For each interactive flow: confirm that all buttons have meaningful names, status messages are announced without receiving focus, error messages are associated with their inputs, and SVG diagrams have useful descriptions.

**Text Spacing and Zoom**

Apply the W3C Text Spacing Bookmarklet and confirm no content is clipped or overlapping. Zoom to 200% and confirm horizontal scrolling is not required at 320 CSS px viewport width (SC 1.4.10 Reflow).

---

### What an Accessibility Statement Must Say

An Accessibility Statement is required by the EU Web Accessibility Directive for public-sector bodies and strongly expected under the European Accessibility Act for private digital products serving EU users. Even for a US-only app, publishing one is a demonstration of good faith in ADA compliance contexts.

The statement must include: the conformance status (fully conformant / partially conformant / not conformant) against WCAG 2.2 Level AA; a list of known non-conformances with reasons and planned remediation dates; the date of the most recent accessibility review; contact information for users to report accessibility barriers; and a feedback mechanism with a response commitment (typically 5–10 business days). It should describe any assistive technologies the app has been tested with, and name any content that is exempt (such as third-party embedded content outside the operator's control). For a children's app, write the statement in plain English understandable by a parent, not in legal or technical jargon.

---

## Part 2 — COPPA 2025 for a No-Account, No-Server, Offline PWA

### What COPPA Is and Whether It Applies

The Children's Online Privacy Protection Act (COPPA) and its implementing Rule (16 CFR Part 312) apply to operators of commercial websites and online services directed to children under 13 that collect, use, or disclose personal information from or about children. The FTC finalised comprehensive amendments on 16 January 2025. These were published in the Federal Register on 22 April 2025, became effective 23 June 2025, and the full compliance deadline is 22 April 2026.

For a strictly offline PWA with no user accounts, no server communication, no analytics SDK, no advertising network, no social sharing, and no device sensor access beyond what the browser provides: COPPA's consent and notice requirements are technically not triggered because no personal information is collected. However, two important nuances apply.

First, the definition of personal information is now broader than most developers assume. The 2025 amendments add biometric identifiers (fingerprints, facial patterns, voiceprints, gait patterns, retina patterns, DNA sequences), government-issued identifiers, and mobile phone numbers used solely for consent purposes to the pre-existing list of names, addresses, email addresses, persistent identifiers (cookies, device IDs, IP addresses), photos, videos, audio recordings, and geolocation data. A math PWA that saves progress to `localStorage` with no user identifier does not create a persistent identifier in the COPPA sense. But if any third-party analytics script, crash-reporting tool, or CDN-served font requests the user's IP address, that is personal information collection, and the operator is responsible.

Second, even if COPPA's formal obligations are not triggered, the FTC's published guidance states that operators of child-directed services that genuinely do not collect personal information should publish a brief notice confirming this. This both protects the operator from enforcement uncertainty and meets parent expectations.

### The 2025 Rule Changes That Matter Most

Third-party disclosure now requires separate verifiable parental consent. This means that embedding any third-party SDK — an analytics library, an advertising partner, a social login — that collects children's data requires distinct consent beyond the general terms of service. For a math app: eliminate all third-party data-collecting SDKs entirely, or obtain separate consent for each. The FTC has signalled that bundled consent buried in terms of service is insufficient.

Data retention is now explicitly limited. Operators may only retain personal information for as long as reasonably necessary to fulfil the original collection purpose. Indefinite retention is prohibited. For a math app that stores only local progress data (never transmitted to a server), this obligation runs to the operator's recommended deletion instructions in the privacy notice.

A formal written information security programme is required for operators who do collect children's data. For a no-data app this requirement is not triggered, but it is good practice to document the architectural decision to collect no data.

The school authorisation exception was deliberately not codified in the 2025 amendments, but the FTC confirmed it will continue to enforce existing guidance: schools may authorise data collection on behalf of parents only for purposes integral to the educational service, not for advertising or behavioural profiling.

### What the Privacy Notice Must Say for a No-Account App

Even though a fully offline no-data app does not trigger COPPA's parental consent obligations, publish a parent-facing privacy notice that:

States clearly and affirmatively that the app does not collect, transmit, or share any personal information from or about children.

Lists any local storage used (such as `localStorage` for progress data), explains that this data never leaves the device, and explains how parents can clear it (browser settings or app uninstall).

Identifies the operator: the legal name and contact information of the person or organisation responsible for the app.

Describes the scope of any network requests (for a PWA: service worker asset caching, manifest fetching) and confirms no personally identifiable data is transmitted in those requests.

States the COPPA determination explicitly: the app is directed to children under 13; the operator has determined that no personal information as defined under 16 CFR Part 312 is collected.

Provides a contact mechanism for parents with questions or concerns, with a response commitment.

---

## Part 3 — Concrete WCAG 2.2 AA Checklist for This App

The following checklist is scoped to a children's math PWA with interactive SVG elements, animated feedback, drag-and-drop activities, and keyboard navigation. Each item maps to a specific success criterion. Check each item manually or via the indicated tool.

**Perceivable**

- [ ] All question text and answer labels pass 4.5:1 contrast ratio against their background (SC 1.4.3). Test with WebAIM Contrast Checker or DevTools colour picker.
- [ ] All SVG strokes, shape fills, and UI component borders that convey meaning pass 3:1 contrast (SC 1.4.11). Test with automated axe-core scan + manual review of SVG elements.
- [ ] Decorative SVGs (background patterns, ornamental icons) carry `aria-hidden="true"` (SC 1.1.1 + 4.1.2).
- [ ] Informational SVGs (fraction diagrams, number lines) carry `role="img"` and a meaningful `<title>` as first child, linked via `aria-labelledby` (SC 1.1.1).
- [ ] Content does not break or overflow when text spacing overrides are applied (1.5× line height, 2× paragraph spacing, 0.12× letter spacing, 0.16× word spacing) (SC 1.4.12). Test with the W3C Text Spacing Bookmarklet.
- [ ] Content reflows to a single column at 320 CSS px viewport width without horizontal scrolling (SC 1.4.10).

**Operable**

- [ ] All interactive elements (answer buttons, hint button, navigation arrows, number-pad keys) are reachable by Tab key with visible focus (SC 2.1.1 + 2.4.7).
- [ ] No keyboard trap exists in any modal dialog, overlay, or custom widget (SC 2.1.2). Test: open every modal, confirm Tab cycles within it, confirm Escape closes it.
- [ ] Every drag-and-drop activity (sorting, placing on number line) has an equivalent single-pointer (tap/click) or keyboard alternative (SC 2.5.7).
- [ ] All interactive targets have a minimum hit area of 24 by 24 CSS pixels; answer buttons and number-pad keys are at least 44 by 44 CSS pixels (SC 2.5.8).
- [ ] When a keyboard-focused element would be hidden by a sticky header or toolbar, the element remains at least partially visible (SC 2.4.11). Test by tabbing through all elements with the toolbar visible.
- [ ] Focus indicators are custom-styled with a minimum 2 px outline and 3:1 contrast between focused/unfocused states (SC 2.4.13 AAA target). Do not rely on the default browser outline.
- [ ] All non-essential animations (confetti, bounce, slide transitions) are suppressed when `prefers-reduced-motion: reduce` is set in the OS (SC 2.3.3 AAA target). Test by enabling reduced motion in macOS/Windows accessibility settings.
- [ ] An in-app "Reduce animations" toggle is available and persisted (best practice supplement to prefers-reduced-motion).

**Understandable**

- [ ] Page language is set via the `lang` attribute on `<html>` (SC 3.1.1).
- [ ] Error messages and hints are specific (not just "Wrong") and suggest a correction (SC 3.3.3 for error suggestion, best practice).

**Robust**

- [ ] All answer-feedback messages (correct/incorrect/score updates) are wrapped in `role="status"` containers present in the DOM on load, with content injected dynamically (SC 4.1.3). Confirm NVDA announces "Correct, three out of five" without the element receiving focus.
- [ ] Interactive SVG widgets that accept keyboard input expose appropriate ARIA roles (`role="slider"`, `role="spinbutton"`, `role="button"`) and have keyboard event handlers (SC 4.1.2).
- [ ] `aria-live` regions are not used for content that does not change during a session (to avoid unnecessary noise) (SC 4.1.3 best practice).

---

## Part 4 — In-App Accessibility Statement and Privacy Note Templates

### Accessibility Statement Template

---

**Accessibility Statement for [App Name]**

Last reviewed: [Month Year]

[App Name] is committed to making this application accessible to children and adults of all abilities.

**Conformance status.** This application targets conformance with the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA. We have also voluntarily implemented several Level AAA criteria, including reduced-motion support and enhanced focus indicators.

**Known limitations.** [List any known non-conformances, for example: "Interactive number-line activities rely on drag gestures; keyboard and tap alternatives are provided for all dragging interactions. We are working to improve the ARIA labelling of fraction-bar diagrams by [target date]."]

**Testing.** This application has been tested using: automated axe-core scans integrated into our continuous integration pipeline; keyboard-only navigation testing; screen reader testing with NVDA and Firefox, and VoiceOver with Safari on iOS.

**Feedback and contact.** If you experience an accessibility barrier, please contact us at [contact email or form URL]. We aim to respond within five business days.

**Date of last review.** [Date]

---

### Parent-Facing Privacy Notice Template

---

**Privacy Notice for Parents and Guardians**

**[App Name]** is a children's math learning application. We want to be completely transparent about how it handles data.

**We do not collect personal information.** This app does not collect, transmit, or share any personal information about your child. There are no user accounts, no login, and no data sent to any server.

**Local storage only.** To save your child's progress between sessions, the app stores a small amount of data (completed levels and scores) in your browser's local storage. This data never leaves your device. You can delete it at any time by clearing your browser's site data or uninstalling the app.

**No third-party tracking.** This app does not include advertising networks, analytics SDKs, or social-media plugins that could track your child's behaviour.

**COPPA statement.** This app is directed to children under 13. Based on the foregoing, we have determined that we do not collect personal information from children as defined under the Children's Online Privacy Protection Rule (16 CFR Part 312). No parental consent is required for your child to use this app.

**Questions?** If you have any questions about this notice, please contact us at [contact email]. We are happy to help.

*This notice was last updated [Month Year] to reflect the 2025 FTC COPPA Rule amendments (effective June 23, 2025).*

---

## Sources Consulted

- W3C WCAG 2.2 Specification and Understanding Documents — https://www.w3.org/TR/WCAG22/
- W3C WAI "What's New in WCAG 2.2" — https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- FTC COPPA Rule Amendments Federal Register Notice (22 April 2025) — https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule
- FTC Press Release: "FTC Finalizes Changes to Children's Privacy Rule" (January 2025) — https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data
- FTC Complying with COPPA: Frequently Asked Questions — https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
- Loeb & Loeb: "Children's Online Privacy in 2025: The Amended COPPA Rule" — https://www.loeb.com/en/insights/publications/2025/05/childrens-online-privacy-in-2025-the-amended-coppa-rule
- Davis Wright Tremaine: "FTC Amends COPPA Rule" — https://www.dwt.com/blogs/privacy--security-law-blog/2025/05/coppa-rule-ftc-amended-childrens-privacy
- Deque axe-core — https://www.deque.com/axe/axe-core/
- WebAIM WCAG 2 Checklist — https://webaim.org/standards/wcag/checklist
- W3C ARIA22 Using role=status — https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22
- Vispero "Using ARIA to enhance SVG accessibility" — https://www.tpgi.com/using-aria-enhance-svg-accessibility/
- Level Access WCAG 2.2 AA Checklist — https://www.levelaccess.com/blog/wcag-2-2-aa-summary-and-checklist-for-website-owners/
