const AIRTABLE_API_URL = 'https://api.airtable.com/v0';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

let cachedStaff = null;
let cacheTimestamp = null;

const normalizeStaffRecord = (record) => {
  const fields = record.fields || {};
  return {
    id: record.id,
    name: fields.name || '',
    bio: fields.bio || '',
    tags: (fields.tags || '')
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean),
    photo: fields.photo?.[0]?.url || null,
    role: fields.role || '',
  };
};

const fetchStaffFromAirtable = async () => {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    throw new Error('Missing Airtable credentials: AIRTABLE_TOKEN and AIRTABLE_BASE_ID are required');
  }

  const url = `${AIRTABLE_API_URL}/${baseId}/Staff`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Airtable authentication failed. Check your token.');
      }
      if (response.status === 404) {
        throw new Error('Airtable base or table not found.');
      }
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const records = data.records || [];
    
    return records.map(normalizeStaffRecord);
  } catch (error) {
    console.error('Error fetching from Airtable:', error.message);
    throw error;
  }
};

const getStaff = async () => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (cachedStaff && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedStaff;
  }

  // Fetch fresh data
  cachedStaff = await fetchStaffFromAirtable();
  cacheTimestamp = now;
  
  return cachedStaff;
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const staff = await getStaff();
    return res.status(200).json({ success: true, data: staff });
  } catch (error) {
    console.error('Staff API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch staff data',
    });
  }
}
