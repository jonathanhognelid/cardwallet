const card = document.getElementById('card');
const cardInner = document.getElementById('cardInner');
const cardBack = document.querySelector('.card-back');
const btn = document.getElementById('btn');
const panel = document.getElementById('panel');
const toggleFreeze = document.getElementById('toggleFreeze');
const toggleCvc = document.getElementById('toggleCvc');
const toggleNumber = document.getElementById('toggleNumber');
const rowCvc = document.getElementById('rowCvc');
const rowNumber = document.getElementById('rowNumber');
const cvcValue = document.getElementById('cvcValue');
const cardNumber = document.getElementById('cardNumber');

let state = 'docked';

btn.addEventListener('click', () => {
  if (state === 'docked') expand();
  else if (state === 'expanded') collapse();
});

function expand() {
  if (state !== 'docked') return;
  state = 'animating';
  btn.disabled = true;

  card.classList.add('lifted');

  setTimeout(() => {
    card.style.zIndex = '6';
  }, 500);

  setTimeout(() => {
    cardInner.classList.add('flipped');
    panel.classList.add('open');

    setTimeout(() => {
      card.classList.remove('lifted');
      card.classList.add('ontop');

      setTimeout(() => {
        btn.classList.add('opened');
        btn.disabled = false;
        state = 'expanded';
      }, 600);
    }, 500);
  }, 600);
}

function collapse() {
  if (state !== 'expanded') return;
  state = 'animating';
  btn.disabled = true;
  btn.classList.remove('opened');
  panel.classList.remove('open');

  // Reset all toggles and card state
  setToggle(toggleFreeze, false);
  setToggle(toggleCvc, false);
  setToggle(toggleNumber, false);
  cardBack.classList.remove('frozen');
  rowCvc.classList.remove('disabled');
  rowNumber.classList.remove('disabled');
  cvcValue.textContent = '000';
  cardNumber.textContent = '0000 0000 0000 0000';

  card.classList.remove('ontop');
  card.classList.add('lifted');

  setTimeout(() => {
    cardInner.classList.remove('flipped');

    setTimeout(() => {
      card.style.zIndex = '2';
      card.classList.remove('lifted');

      setTimeout(() => {
        btn.disabled = false;
        state = 'docked';
      }, 600);
    }, 500);
  }, 600);
}

function setToggle(el, on) {
  el.classList.toggle('on', on);
  el.setAttribute('aria-checked', on);
}

function makeDigitSlot(fromChar, toChar) {
  const slot = document.createElement('span');
  slot.className = 'digit-slot';

  const track = document.createElement('span');
  track.className = 'digit-track';

  const rowNew = document.createElement('span');
  rowNew.className = 'digit-row';
  rowNew.textContent = toChar;

  const rowOld = document.createElement('span');
  rowOld.className = 'digit-row';
  rowOld.textContent = fromChar;

  // New sits above old in the track; track starts shifted to show "old"
  track.appendChild(rowNew);
  track.appendChild(rowOld);
  slot.appendChild(track);
  return slot;
}

function animateDigits(el, hiddenText, revealText, on) {
  const fromText = on ? hiddenText : revealText;
  const toText = on ? revealText : hiddenText;

  el.innerHTML = '';
  const frag = document.createDocumentFragment();
  const tracks = [];

  for (let i = 0; i < toText.length; i++) {
    const fromChar = fromText[i] ?? ' ';
    const toChar = toText[i] ?? ' ';

    if (fromChar === toChar) {
      const span = document.createElement('span');
      span.textContent = toChar === ' ' ? '\u00A0' : toChar;
      frag.appendChild(span);
    } else {
      const fc = fromChar === ' ' ? '\u00A0' : fromChar;
      const tc = toChar === ' ' ? '\u00A0' : toChar;
      const slot = makeDigitSlot(fc, tc);
      frag.appendChild(slot);
      tracks.push(slot.querySelector('.digit-track'));
    }
  }

  el.appendChild(frag);

  // Trigger the roll, staggered per digit
  requestAnimationFrame(() => {
    tracks.forEach((track, idx) => {
      setTimeout(() => {
        track.classList.add('rolled');
      }, idx * 55);
    });
  });
}

// Row clicks trigger toggle
document.querySelectorAll('.toggle-row').forEach(row => {
  row.addEventListener('click', () => {
    const toggle = row.querySelector('.toggle');
    toggle.click();
  });
});

// Freeze — single class drives all visual layers via CSS
toggleFreeze.addEventListener('click', (e) => {
  e.stopPropagation();
  const on = !toggleFreeze.classList.contains('on');
  setToggle(toggleFreeze, on);
  cardBack.classList.toggle('frozen', on);

  // Disable the other two toggles while frozen, and turn them off first if active
  rowCvc.classList.toggle('disabled', on);
  rowNumber.classList.toggle('disabled', on);

  if (on) {
    if (toggleCvc.classList.contains('on')) {
      setToggle(toggleCvc, false);
      animateDigits(cvcValue, '000', '565', false);
    }
    if (toggleNumber.classList.contains('on')) {
      setToggle(toggleNumber, false);
      animateDigits(cardNumber, '0000 0000 0000 0000', '5356 8302 1219 6566', false);
    }
  }
});

toggleCvc.addEventListener('click', (e) => {
  e.stopPropagation();
  const on = !toggleCvc.classList.contains('on');
  setToggle(toggleCvc, on);
  animateDigits(cvcValue, '000', '565', on);
});

toggleNumber.addEventListener('click', (e) => {
  e.stopPropagation();
  const on = !toggleNumber.classList.contains('on');
  setToggle(toggleNumber, on);
  animateDigits(cardNumber, '0000 0000 0000 0000', '5356 8302 1219 6566', on);
});

lucide.createIcons();