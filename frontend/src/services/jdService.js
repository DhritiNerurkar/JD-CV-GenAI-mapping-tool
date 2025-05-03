import apiClient from './apiClient';

export const fetchJds = async () => {
  try {
    const response = await apiClient.get('/jds/');
    return response.data;
  } catch (error) {
    console.error("Error fetching JDs:", error);
    throw error; // Re-throw to be caught by the component
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

export const deleteJd = async (jdId) => {
  try {
    const response = await apiClient.delete(`/jds/${jdId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting JD ${jdId}:`, error);
    throw error;
  }
};