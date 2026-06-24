const card = document.getElementById('card');
const cardInner = document.getElementById('cardInner');
const btn = document.getElementById('btn');
const hint = document.getElementById('hint');

let state = 'docked';

btn.addEventListener('click', () => {
  if (state !== 'docked' && state !== 'ontop') return;

  if (state === 'docked') {
    state = 'animating';
    btn.disabled = true;
    btn.textContent = '...';

    // Lift behind wallet front first
    card.classList.add('lifted');

    // Swap z-index near the top of the lift (500ms into 600ms lift)
    setTimeout(() => {
      card.style.zIndex = '6';
    }, 500);

    // Flip once fully lifted
    setTimeout(() => {
      cardInner.classList.add('flipped');

      setTimeout(() => {
        card.classList.remove('lifted');
        card.classList.add('ontop');

        setTimeout(() => {
          hint.classList.add('visible');
          btn.textContent = 'Hide details';
          btn.disabled = false;
          state = 'ontop';
        }, 600);
      }, 500);
    }, 600);

  } else {
    state = 'animating';
    btn.disabled = true;
    btn.textContent = '...';
    hint.classList.remove('visible');

    card.classList.remove('ontop');
    card.classList.add('lifted');

    setTimeout(() => {
      cardInner.classList.remove('flipped');

      setTimeout(() => {
        // Drop z-index BEFORE descending so it goes back behind wallet front
        card.style.zIndex = '2';
        card.classList.remove('lifted');

        setTimeout(() => {
          btn.textContent = 'Show details';
          btn.disabled = false;
          state = 'docked';
        }, 600);
      }, 500);
    }, 600);
  }
});