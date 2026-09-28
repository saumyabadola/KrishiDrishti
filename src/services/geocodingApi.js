// ─────────────────────────────────────────────────────────────────────────────
// Nominatim Geocoding — Free OpenStreetMap geocoder (no API key needed)
// ─────────────────────────────────────────────────────────────────────────────

const BASE = 'https://nominatim.openstreetmap.org';

/**
 * Search for a place by name. Returns array of results.
 * Each result has: { displayName, lat, lng, type, address }
 */
export async function searchLocation(query) {
  if (!query || query.trim().length < 2) return [];

  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: '8',
      countrycodes: 'in', // restrict to India
    });

    const res = await fetch(`${BASE}/search?${params}`, {
      headers: { 'Accept-Language': 'en' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return data.map((item) => ({
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: item.type,
      address: item.address || {},
      state: item.address?.state || '',
      district: item.address?.state_district || item.address?.county || '',
      village: item.address?.village || item.address?.town || item.address?.city || '',
      boundingbox: item.boundingbox
        ? item.boundingbox.map(Number)
        : null,
    }));
  } catch (err) {
    console.warn('Nominatim search failed:', err.message);
    return [];
  }
}

/**
 * Reverse geocode: given coords, find the place name.
 * Returns { displayName, state, district, village, ... } or null.
 */
export async function reverseGeocode(lat, lng) {
  try {
    const params = new URLSearchParams({
      lat: lat.toFixed(6),
      lon: lng.toFixed(6),
      format: 'json',
      addressdetails: '1',
      zoom: '14',
    });

    const res = await fetch(`${BASE}/reverse?${params}`, {
      headers: { 'Accept-Language': 'en' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return {
      displayName: data.display_name,
      state: data.address?.state || '',
      district: data.address?.state_district || data.address?.county || '',
      village: data.address?.village || data.address?.town || data.address?.city || '',
      block: data.address?.suburb || data.address?.hamlet || '',
    };
  } catch (err) {
    console.warn('Reverse geocode failed:', err.message);
    return null;
  }
}

/**
 * Debounced search — call this from UI input handlers.
 * Returns a Promise that resolves after `delay` ms of inactivity.
 */
let debounceTimer = null;
export function debouncedSearch(query, delay = 400) {
  return new Promise((resolve) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const results = await searchLocation(query);
      resolve(results);
    }, delay);
  });
}
