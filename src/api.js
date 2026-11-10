// Utility to fetch staff data from the backend API
export const fetchStaffData = async () => {
  try {
    // Use the appropriate API endpoint based on environment
    const apiBase = process.env.REACT_APP_API_URL || '/api';
    const response = await fetch(`${apiBase}/staff`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch staff data');
    }

    return result.data || [];
  } catch (error) {
    console.error('Failed to fetch staff:', error);
    throw error;
  }
};
