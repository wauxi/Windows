import { apiKey, useProxy, proxy, DEFAULT_RADIUS, useMock } from './config.js';

export async function fetchNearbyPlaces(lat, lng, type = 'cafe', radius = DEFAULT_RADIUS) {
  if (useMock) {
    const resp = await fetch('data/mock-places.json');
    if (!resp.ok) throw new Error(`Mock data HTTP ${resp.status}`);
    return resp.json();
  }

  const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;
  const url = useProxy ? proxy + endpoint : endpoint;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  return data;
}
