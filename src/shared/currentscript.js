(function () {
    var root = document.currentScript && document.currentScript.closest('.hw-rdsc');
    if (!root) { root = document.querySelector('.hw-rdsc'); }
    if (!root || root.dataset.hwInit) { return; }
    root.dataset.hwInit = '1';

    var chips = root.querySelectorAll('.hw-rdsc__chip');
    var cards = root.querySelectorAll('.hw-rdsc__card');
    var empty = root.querySelector('#hwRdscEmpty');

    function applyFilter(filter) {
      var shown = 0;
      cards.forEach(function (card, i) {
        var match = (filter === 'all') || (card.getAttribute('data-cat') === filter);
        if (match) {
          card.classList.remove('is-hidden');
          // restagger reveal
          card.style.animation = 'none';
          // force reflow then replay
          void card.offsetWidth;
          card.style.animation = 'hwRdscIn .45s both';
          card.style.animationDelay = (shown * 45) + 'ms';
          shown++;
        } else {
          card.classList.add('is-hidden');
        }
      });
      if (empty) { empty.hidden = shown !== 0; }
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) {
          c.classList.remove('is-active');
          c.setAttribute('aria-selected', 'false');
        });
        chip.classList.add('is-active');
        chip.setAttribute('aria-selected', 'true');
        applyFilter(chip.getAttribute('data-filter'));
      });
    });

    // initial staggered reveal
    cards.forEach(function (card, i) {
      card.style.animationDelay = (i * 55) + 'ms';
    });
  })();
