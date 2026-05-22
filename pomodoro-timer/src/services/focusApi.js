const API_BASE_URL = 'http://localhost:8000';

export const predictFocusReadiness = async (energy, stress, motivation) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/predict-readiness`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        energy: parseInt(energy),
        stress: parseInt(stress),
        motivation: parseInt(motivation),
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to predict focus readiness:', error);
    throw error;
  }
};

export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return null;
  }
};