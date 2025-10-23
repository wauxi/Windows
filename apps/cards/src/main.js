import { getCachedLocation, setCachedLocation, requestCurrentLocation } from './geolocation.js';
import { fetchNearbyPlaces } from './places.js';
import { renderPlaces, clearCards } from './ui.js';
import { attachHammer, initStack } from './hammer.js';
import { getSavedCafes, addCafe } from './storage.js';
import { showToast } from './toast.js';
import { useMock } from './config.js';

function handlePlacesData(data) {
  if (data && data.status && data.status !== 'OK') {
    showToast(`Places API status: ${data.status}` + (data.error_message ? ' — ' + data.error_message : ''));
    return false;
  }
  if (data && data.results && data.results.length) {
    renderPlaces(data.results, { attachHammer, saveCafe: addCafe, excludeSaved: true });
    initStack();
    return true;
  }
  showToast('No cafes found nearby.');
  return false;
}

export async function initApp() {
  window.getLocation = async function() {
    if (useMock) {
      try {
        const data = await fetchNearbyPlaces();
        handlePlacesData(data);
      } catch (e) {
        console.error(e);
        showToast('Failed to retrieve mock data. Please check the console.');
      }
      return;
    }

    const cache = getCachedLocation();
    const now = Date.now();
    
    if (cache && cache.timestamp && now - cache.timestamp < 10 * 60 * 1000) {
      try {
        const data = await fetchNearbyPlaces(cache.lat, cache.lng);
        handlePlacesData(data);
      } catch (e) {
        console.error(e);
        showToast('Failed to retrieve location data. Please try again.');
      }
      return;
    }

    requestCurrentLocation(async ({ lat, lng }) => {
      setCachedLocation(lat, lng);
      try {
        const data = await fetchNearbyPlaces(lat, lng);
        handlePlacesData(data);
      } catch (e) {
        console.error(e);
        showToast('Failed to retrieve location data. Please try again.');
      }
    }, () => showToast('Location access denied or unavailable.'));
  }

  window.showSavedCafes = function() {
    clearCards();
    const saved = getSavedCafes();
    if (saved.length === 0) {
      document.querySelector('.cards').innerHTML = '<p>No saved cafes.</p>';
      return;
    }
    renderPlaces(saved, { attachHammer, saveCafe: addCafe, excludeSaved: false, isSavedView: true });
  }

  document.getElementById('btn-nearby').addEventListener('click', window.getLocation);
  document.getElementById('btn-saved').addEventListener('click', window.showSavedCafes);
}

initApp();

document.addEventListener('dragstart', event => {
  if (event.target.tagName === 'IMG') event.preventDefault();
});

