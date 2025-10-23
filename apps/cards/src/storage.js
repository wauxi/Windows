const STORAGE_KEY = 'savedCafes';

export function getSavedCafes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function setSavedCafes(cafes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cafes));
}

export function addCafe(cafe) {
  const cafes = getSavedCafes();
  if (!cafes.find(c => c.place_id === cafe.place_id)) {
    cafes.push(cafe);
    setSavedCafes(cafes);
    return true;
  }
  return false;
}

export function removeCafe(placeId) {
  const cafes = getSavedCafes();
  const filtered = cafes.filter(c => c.place_id !== placeId);
  setSavedCafes(filtered);
  return filtered.length < cafes.length;
}

export function isCafeSaved(placeId) {
  return getSavedCafes().some(c => c.place_id === placeId);
}
