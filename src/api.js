
export const fetchStaffData = async () => {
  try {
    const response = await fetch('/api/staff');

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
