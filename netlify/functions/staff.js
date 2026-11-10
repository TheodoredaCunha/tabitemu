
const AIRTABLE_API_URL = 'https://api.airtable.com/v0';
const CACHE_DURATION = 5 * 60 * 1000;

let cachedStaff = null;
let cacheTimestamp = 0;

const jsonResponse = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });

const normalizeStaffRecord = (record) => {
  const fields = record.fields || {};

  return {
    id: record.id,
    name: fields.name || '',
    bio: fields.bio || '',
    role: fields.role || '',
    tags: (fields.tags || '')
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean),
    photo: fields.photo?.[0]?.url || null,
  };
};

async function fetchStaffFromAirtable() {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    throw new Error(
      'Missing Airtable credentials: AIRTABLE_TOKEN and AIRTABLE_BASE_ID are required'
    );
  }

  const url = `${AIRTABLE_API_URL}/${baseId}/Staff`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Airtable authentication failed. Check your token.');
    }

    if (response.status === 404) {
      throw new Error('Airtable base or table not found.');
    }

    throw new Error(
      `Airtable API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return (data.records || []).map(normalizeStaffRecord);
}

async function getStaff() {
  const now = Date.now();

  if (cachedStaff && now - cacheTimestamp < CACHE_DURATION) {
    return cachedStaff;
  }

  cachedStaff = await fetchStaffFromAirtable();
  cacheTimestamp = now;

  return cachedStaff;
}

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return jsonResponse({}, 200);
  }

  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const staff = await getStaff();

    return jsonResponse({
      success: true,
      data: staff,
    });
  } catch (error) {
    console.error('Staff API error:', error);

    return jsonResponse({
      success: false,
      error: error.message || 'Failed to fetch staff data',
    }, 500);
  }
}
