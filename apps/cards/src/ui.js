import { apiKey } from './config.js';
import { initStack } from './hammer.js';
import { getSavedCafes, removeCafe } from './storage.js';
import { ANIMATION } from './constants.js';

export function clearCards() {
  const container = document.querySelector('.cards');
  container.innerHTML = '';
}

function triggerExitAnimation(wrapper, exitClass) {
  wrapper.classList.add('removed');
  wrapper.style.transform = 'translate(0, 0) rotate(0)';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      wrapper.classList.add(exitClass);
      wrapper.style.transform = '';
    });
  });
}

function createCardHTML(cafe, cafeData, isSavedView) {
  const imgUrl = cafeData.photo;
  
  const buttons = isSavedView 
    ? `<button class="card-action card-nope" data-action="remove" title="Remove">&#x2716;</button>`
    : `<div class="card-actions">
        <button class="card-action card-nope" data-action="nope" title="Nope">&#x2716;</button>
        <button class="card-action card-love" data-action="love" title="Save">&#x2764;</button>
      </div>`;
  
  return `
    <div class="location-card" data-place-id="${cafeData.place_id}">
      <img src="${encodeURI(imgUrl)}" alt="${cafe.name || 'Cafe'}">
      <div class="card-body">
        <h3>${cafe.name || 'Unnamed Cafe'}</h3>
        <p>⭐️ Rating: ${cafe.rating || 'N/A'}</p>
        ${buttons}
      </div>
    </div>
  `;
}

export function renderPlaces(places, { attachHammer, saveCafe, excludeSaved = false, isSavedView = false } = {}) {
  const container = document.querySelector('.cards');
  container.innerHTML = '';
  
  container.classList.remove('cards-fade-in');
  void container.offsetWidth; 
  container.classList.add('cards-fade-in');

  let filtered = places;
  if (excludeSaved) {
    const saved = getSavedCafes();
    const savedIds = new Set(saved.map(s => s.place_id));
    filtered = places.filter(p => !savedIds.has(p.place_id));
  }

  filtered.forEach((cafe, i) => {
    const imgUrl = cafe.photo
      || (cafe.photos?.[0]?.photo_reference
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${cafe.photos[0].photo_reference}&key=${apiKey}`
        : "https://via.placeholder.com/250x150?text=No+Image");

    const cafeData = {
      name: cafe.name || 'Unnamed Cafe',
      place_id: cafe.place_id || 'N/A',
      photo: imgUrl,
      rating: cafe.rating || 'N/A'
    };

    const wrapper = document.createElement('div');
    wrapper.className = isSavedView ? 'saved-wrapper' : 'swipe-wrapper';
    wrapper.dataset.zIndex = 200 - i;
    wrapper.innerHTML = createCardHTML(cafe, cafeData, isSavedView);

    if (isSavedView) {
      const removeBtn = wrapper.querySelector('[data-action="remove"]');
      removeBtn?.addEventListener('click', () => {
        removeCafe(cafeData.place_id);
        triggerExitAnimation(wrapper, 'card-exit-left');
        setTimeout(() => wrapper.remove(), ANIMATION.SWIPE_DURATION);
      });
    } else {
      const nopeBtn = wrapper.querySelector('[data-action="nope"]');
      const loveBtn = wrapper.querySelector('[data-action="love"]');
      
      nopeBtn?.addEventListener('click', (e) => {
        triggerExitAnimation(wrapper, 'card-exit-left');
        setTimeout(() => {
          wrapper.remove();
          initStack();
        }, ANIMATION.SWIPE_DURATION);
        e.preventDefault();
      });

      loveBtn?.addEventListener('click', (e) => {
        triggerExitAnimation(wrapper, 'card-exit-right');
        if (typeof saveCafe === 'function') {
          saveCafe(cafeData);
        }
        setTimeout(() => {
          wrapper.remove();
          initStack();
        }, ANIMATION.SWIPE_DURATION);
        e.preventDefault();
      });
    }

    container.appendChild(wrapper);

    if (attachHammer) {
      if (isSavedView) {
        attachHammer(wrapper, () => removeCafe(cafeData.place_id), () => {});
      } else {
        attachHammer(wrapper, () => {}, () => { 
          if (saveCafe) saveCafe(cafeData);
        });
      }
    }
  });
}
