const FONT_STACKS = [
  '"Outfit", sans-serif',
  '"Space Grotesk", sans-serif',
  '"Press Start 2P", monospace',
  '"VT323", monospace',
  '"Bungee", sans-serif',
  '"Rubik Mono One", sans-serif',
  '"Major Mono Display", monospace'
];

const SIGNAL_TEXT = 'HHG26 // GOA INDIA // BUILD LOUD // MAKE SOMETHING REAL // ';

function createLetters(text) {
  const fragment = document.createDocumentFragment();
  [...text].forEach((character, index) => {
    const letter = document.createElement('span');
    letter.className = 'marquee-letter';
    letter.textContent = character === ' ' ? '\u00a0' : character;
    letter.setAttribute('aria-hidden', 'true');
    letter.dataset.index = String(index);
    fragment.appendChild(letter);
  });
  return fragment;
}

function randomizeLetterFonts(groups) {
  groups.forEach((group) => {
    group.querySelectorAll('.marquee-letter').forEach((letter) => {
      const font = FONT_STACKS[Math.floor(Math.random() * FONT_STACKS.length)];
      letter.style.fontFamily = font;
    });
  });
}

export function initMarquee() {
  const primary = document.querySelector('#marqueePrimary');
  const clone = document.querySelector('#marqueeClone');
  if (!primary || !clone) return;

  primary.replaceChildren(createLetters(SIGNAL_TEXT));
  clone.replaceChildren(createLetters(SIGNAL_TEXT));
  const groups = [primary, clone];

  randomizeLetterFonts(groups);
  window.setInterval(() => randomizeLetterFonts(groups), 1000);
}
