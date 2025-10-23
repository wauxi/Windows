export function getCachedLocation() {
  const raw = localStorage.getItem('cachedLocation');
  return raw ? JSON.parse(raw) : null;
}

export function setCachedLocation(lat, lng) {
  const now = Date.now();
  localStorage.setItem('cachedLocation', JSON.stringify({ lat, lng, timestamp: now }));
}

export function requestCurrentLocation(successCb, errorCb) {
  if (!navigator.geolocation) {
    if (typeof errorCb === 'function') errorCb(new Error('Geolocation not supported'));
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => successCb({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
    err => errorCb(err),
    { enableHighAccuracy: true }
  );
}