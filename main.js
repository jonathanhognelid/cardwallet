const card = document.getElementById('card');
const cardInner = document.getElementById('cardInner');
const btn = document.getElementById('btn');
const hint = document.getElementById('hint');
const panel = document.getElementById('panel');
const freezeOverlay = document.getElementById('freezeOverlay');
const toggleFreeze = document.getElementById('toggleFreeze');
const togglePin = document.getElementById('togglePin');
const toggleDetails = document.getElementById('toggleDetails');
const pinValue = document.getElementById('pinValue');
const cardNumber = document.getElementById('cardNumber');

let state = 'docked';

btn.addEventListener('click', () => {
  if (state === 'docked') {
    expand();
  } else if (state === 'expanded') {
    collapse();
  }
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
        hint.classList.add('visible');
        btn.classList.add('icon-state');
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

  hint.classList.remove('visible');
  panel.classList.remove('open');
  btn.classList.remove('icon-state');

  setToggle(toggleFreeze, false);
  setToggle(togglePin, false);
  setToggle(toggleDetails, false);
  freezeOverlay.classList.remove('active');
  pinValue.textContent = '••••';
  cardNumber.textContent = '•••• •••• •••• ••••';

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

function animateReveal(el, hiddenText, revealText) {
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = revealText;
    el.style.opacity = '1';
  }, 300);
}

// Clicking anywhere on the row triggers the toggle
document.querySelectorAll('.toggle-row').forEach(row => {
  row.addEventListener('click', () => {
    const toggle = row.querySelector('.toggle');
    toggle.click();
  });
});

// But stop toggle button clicks from double-firing
toggleFreeze.addEventListener('click', (e) => {
  e.stopPropagation();
  const on = !toggleFreeze.classList.contains('on');
  setToggle(toggleFreeze, on);
  freezeOverlay.classList.toggle('active', on);
});

togglePin.addEventListener('click', (e) => {
  e.stopPropagation();
  const on = !togglePin.classList.contains('on');
  setToggle(togglePin, on);
  animateReveal(pinValue, '••••', on ? '7497' : '••••');
});

toggleDetails.addEventListener('click', (e) => {
  e.stopPropagation();
  const on = !toggleDetails.classList.contains('on');
  setToggle(toggleDetails, on);
  animateReveal(cardNumber, '•••• •••• •••• ••••', on ? '5356 8302 1219 6566' : '•••• •••• •••• ••••');
});

lucide.createIcons();