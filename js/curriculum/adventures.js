export default {
  chapters: [
    {
      id: 'ch1',
      title: 'The Whispering Woods',
      emoji: '🌲',
      blurb: 'Strange silence has fallen — can {pet} wake the forest? 🌿',
      intro: 'Deep in the Whispering Woods, the trees have gone quiet and the forest critters are worried. Lucky for everyone, {pet} has arrived — and a big adventure is just beginning!',
      scenes: [
        {
          id: 'ch1-s1',
          art: '🗺️',
          story: 'At the edge of the woods, {pet} finds a giant map carved into an old oak tree. The numbers on the map are enormous — some go all the way to the hundred-thousands! A wise owl hoots: "Only someone who truly understands big numbers can read this map." {pet} takes a deep breath and gets to work.',
          skill: 'g4-place-value',
          teach: true,
          success: '{pet} reads the map like a pro, and the owl does a happy little dance. "Onward!" the owl cheers, pointing a wing deeper into the woods. 🦉',
          reward: { coins: 10, treats: 1 }
        },
        {
          id: 'ch1-s2',
          art: '🌉',
          story: 'The path leads to a rickety rope bridge over a bubbling stream. A beaver family has posted a sign: "BRIDGE WEIGHT LIMIT — ROUND TO THE NEAREST HUNDRED TO CHECK!" {pet} counts up all the travelers waiting to cross and realizes someone needs to round that big number before anyone takes a step.',
          skill: 'g4-rounding',
          teach: true,
          success: '{pet} rounds the number perfectly, and the bridge-keeper beaver stamps a little paw-print of approval. Everyone crosses safely — even the chubby raccoon with the backpack. 🦝',
          reward: { coins: 10, treats: 0 }
        },
        {
          id: 'ch1-s3',
          art: '🌸',
          story: 'In the Meadow of a Thousand Petals, two rival squirrel teams have been collecting flower seeds all day. They want to combine their piles into one grand total, but the numbers are big enough to need some regrouping. "We\'ll share equally," a squirrel declares, "but only once {pet} adds it up correctly!" 🐿️',
          skill: 'g4-add-regroup',
          teach: true,
          success: '{pet} lines up the digits, carries the right numbers, and announces the grand total. Both squirrel teams cheer and pour their seeds into one enormous heap. 🌻',
          reward: { coins: 12, treats: 1 }
        },
        {
          id: 'ch1-s4',
          art: '🍄',
          story: 'Deep in Mushroom Glen, a family of hedgehogs is trying to figure out how many acorns they\'ll have left after sharing some with their neighbors. "We started with a big pile," Grandma Hedgehog explains, "and we gave some away — but how many do we still have?" The numbers are big and regrouping is tricky. {pet} rolls up their sleeves. 🦔',
          skill: 'g4-sub-regroup',
          teach: true,
          success: '{pet} subtracts carefully — regrouping just right — and Grandma Hedgehog counts the remaining acorns with a delighted squeak. "Perfect! Now we can plan the winter feast!" 🎉',
          reward: { coins: 10, treats: 0 }
        },
        {
          id: 'ch1-s5',
          art: '🏰',
          story: 'At last, {pet} reaches the Heartwood Tree — the tallest tree in all the Whispering Woods. The ancient door has a multiplication lock: planks on the bridge leading to it are arranged in equal rows, and the total number is the password. {pet} counts the rows, counts each row\'s planks, and multiplies to unlock the tree\'s secret chamber. 🔐',
          skill: 'g4-mult-3x1',
          teach: true,
          success: '{pet} multiplies like lightning, the door swings open, and a shower of golden leaves falls from the branches above. The Heartwood Tree hums with life again! ✨',
          reward: { coins: 16, treats: 1 }
        }
      ],
      outro: '{pet} has woken the Whispering Woods — the trees rustle happily and every creature cheers. But word travels fast: far beyond the woods, the Sparkle Caves need help too!'
    },
    {
      id: 'ch2',
      title: 'The Sparkle Caves',
      emoji: '💎',
      blurb: 'Glittering crystals, slippery tunnels, and a math mystery underground! 🔦',
      intro: 'Below the rolling hills lies a maze of caves where crystals glow every color of the rainbow. The mole miners who live here have hit a big problem, and they\'re counting on {pet} to dig them out!',
      scenes: [
        {
          id: 'ch2-s1',
          art: '⛏️',
          story: 'The head miner, a distinguished mole named Mortimer, greets {pet} at the cave entrance. "We need to place crystals in a rectangular grid," he explains, adjusting his tiny hard hat. "Two groups of workers, each carrying a different number of trays — multiply it out and tell me the total before anyone trips over anything!" 🐾',
          skill: 'g4-mult-2x2',
          teach: true,
          success: '{pet} works through both groups of numbers, multiplies them together, and Mortimer writes the answer on his clipboard with a proud flourish. "Magnificent! We can set up the whole display!" 💎',
          reward: { coins: 14, treats: 1 }
        },
        {
          id: 'ch2-s2',
          art: '🔦',
          story: 'Deeper in the cave, young mole apprentices are dividing a cart of sparkling gems into equal pouches for the gem market. "We want every pouch to have the same number," an apprentice explains, "no more, no less!" {pet} counts the gems and the pouches and figures out how many go in each. 💼',
          skill: 'g4-div-basic',
          teach: true,
          success: '{pet} divides everything evenly and the apprentices fill every pouch to the brim. "Now THAT\'S what I call gem math!" says the apprentice, doing a little underground jig. 💃',
          reward: { coins: 12, treats: 0 }
        },
        {
          id: 'ch2-s3',
          art: '🧺',
          story: 'The gem-sorting room holds a tricky situation: a big batch of crystals needs to be packed into boxes, but the number of crystals doesn\'t divide perfectly. "Some will be left over," sighs the packing mole. "How many go in each box and how many are left?" {pet} takes on the challenge of division with remainders. 😤',
          skill: 'g4-div-remainder',
          teach: true,
          success: '{pet} figures out the quotient AND the remainder, and the packing mole sighs with relief. "Leftovers go in the gift bag — nothing wasted in the Sparkle Caves!" 🎁',
          reward: { coins: 14, treats: 1 }
        },
        {
          id: 'ch2-s4',
          art: '🌀',
          story: 'The cave\'s crystal calendar is organized around special numbers — numbers that divide evenly into the big "Crystal Count." Mortimer needs to know all the factors of this year\'s crystal total before the solstice ceremony, and whether any multiples of a key number show up on the schedule. {pet} starts listing and checking. 📅',
          skill: 'g4-factors-multiples',
          teach: true,
          success: '{pet} lists every factor and identifies the right multiples, and Mortimer marks the solstice calendar with a sparkling gem sticker. "You\'ve saved the ceremony!" he cheers. 🎊',
          reward: { coins: 12, treats: 0 }
        },
        {
          id: 'ch2-s5',
          art: '💡',
          story: 'Near the deepest crystal chamber, {pet} discovers the "Prime Pillar" — a legendary column of rock that can only be unlocked if you know which numbers carved on its surface are prime. The cave trembles with excitement as {pet} examines each number, separating the primes from the rest. 🏛️',
          skill: 'g4-prime',
          teach: true,
          success: '{pet} identifies every prime number perfectly, the Prime Pillar glows bright white, and a hidden passage opens to the most beautiful crystal garden ever seen. Every mole gasps in wonder. 🌟',
          reward: { coins: 16, treats: 1 }
        }
      ],
      outro: 'The Sparkle Caves gleam brighter than ever, and Mortimer shakes {pet}\'s paw with tears in his tiny eyes. "There\'s one more place that needs your help," he whispers. "The Cloud Castle — they\'re running out of time!"'
    },
    {
      id: 'ch3',
      title: 'The Cloud Castle',
      emoji: '☁️',
      blurb: 'Float up to a magical sky fortress to save the lost star! ⭐',
      intro: 'High above the clouds, a grand castle floats among the stars — and somewhere inside, a tiny lost star waits to be found. {pet} leaps onto a cloud-elevator and rises up, ready for the final adventure!',
      scenes: [
        {
          id: 'ch3-s1',
          art: '🌤️',
          story: 'The Cloud Castle\'s royal baker, a round little cloud-bear named Puffina, has a problem: the recipe for "Star Puffs" needs to be adjusted so each pastry uses the same fraction of stardust. She shows {pet} two fractions that look different but might be the same. "Are these equivalent?" she asks hopefully. 🧁',
          skill: 'g4-equiv-fractions',
          teach: true,
          success: '{pet} checks the fractions and confirms they\'re equivalent — Puffina does a happy waddle-dance and pops the first batch in the oven. The whole castle fills with the sweet smell of stardust and cinnamon. 🍪',
          reward: { coins: 12, treats: 1 }
        },
        {
          id: 'ch3-s2',
          art: '🏰',
          story: 'In the castle\'s grand hall, two knight-clouds are arguing about who gets a bigger slice of the enchanted moon-cake. Each holds up a fraction. "Which is greater?" they demand. {pet} knows this matters — whichever fraction is bigger wins the first slice, and a fight is about to break out. ⚔️',
          skill: 'g4-fraction-compare',
          teach: true,
          success: '{pet} compares the fractions quickly and fairly, announces the winner, and the losing knight gracefully bows. "Well compared!" they both say, and share a high-five. The cake is delicious. 🎂',
          reward: { coins: 10, treats: 0 }
        },
        {
          id: 'ch3-s3',
          art: '🌈',
          story: 'A rainbow bridge leads to the Star Tower, but it\'s cracked in two places. Each section is missing a fraction of its color tiles. To fix the bridge, {pet} has to add the two missing fractions together and then take away the overlap. The cloud architects hold their breath. 🌉',
          skill: 'g4-fraction-add-sub',
          teach: true,
          success: '{pet} adds and subtracts fractions flawlessly, and the rainbow bridge snaps back into place with a satisfying CLICK and a burst of color. The architects burst into applause! 🎆',
          reward: { coins: 14, treats: 1 }
        },
        {
          id: 'ch3-s4',
          art: '⭐',
          story: 'Inside the Star Tower, the lost star is curled up in a glass jar. The jar\'s label says it can only be opened when the correct decimal is entered on the lock — the exact weight of stardust inside, written with tenths and hundredths. {pet} reads the scale carefully and punches in the decimal number. 🔢',
          skill: 'g4-decimals',
          teach: true,
          success: '{pet} enters the decimal perfectly, the jar springs open, and the tiny star leaps out with a joyful twinkle, showering golden sparks across the whole tower. 💫',
          reward: { coins: 14, treats: 1 }
        },
        {
          id: 'ch3-s5',
          art: '🎇',
          story: 'For the grand farewell celebration, the cloud-castle critters want to decorate the courtyard with a glowing tile border and fill the center with a starlight rug. "We need to know the perimeter for the border trim and the area for the rug," says Queen Cumulus. "Can {pet} measure it all out?" The whole adventure comes down to this final challenge! 👑',
          skill: 'g4-perimeter-area',
          teach: true,
          success: '{pet} calculates the perimeter AND the area — perfectly — and the castle erupts in the biggest, sparkliest, cloud-confetti celebration the sky has ever seen. The star dances, Puffina bakes a victory cake, and everyone cheers the name of {pet}, the greatest hero the clouds have ever known! 🎉🌟',
          reward: { coins: 20, treats: 1 }
        }
      ],
      outro: 'The lost star is safe, the Cloud Castle shines, and {pet} floats back down on a friendly cloud to the cheers of every forest critter and cave mole below. What a hero!'
    }
  ]
}
