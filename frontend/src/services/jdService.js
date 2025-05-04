import apiClient from './apiClient';

export const fetchJds = async () => {
  try {
    const response = await apiClient.get('/jds/');
    return response.data;
  } catch (error) {
    console.error("Error fetching JDs:", error);
    throw error;
  }
};

export const addJd = async (jdData) => {
  try {
    const response = await apiClient.post('/jds/', jdData);
    return response.data;
  } catch (error) {
    console.error("Error adding JD:", error);
    throw error;
  }
};

// --- NEW UPDATE FUNCTION ---
export const updateJd = async (jdId, jdData) => {
  try {
      // Use PUT request to the specific JD endpoint
      const response = await apiClient.put(`/jds/${jdId}`, jdData);
      return response.data; // Return the updated JD data from backend
  } catch (error) {
      console.error(`Error updating JD ${jdId}:`, error);
      throw error;
  }
};
// --- END NEW UPDATE FUNCTION ---


export const deleteJd = async (jdId) => {
  try {
    const response = await apiClient.delete(`/jds/${jdId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting JD ${jdId}:`, error);
    throw error;
  }
};