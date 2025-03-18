import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const blindboxService = {
  getBlindboxSeries: async (page = 0, size = 20, sort = ['id', 'asc'], seriesName = null) => {
    try {
      let url = `${API_BASE_URL}/blindbox?page=${page}&size=${size}&sort=${sort[0]},${sort[1]}`;
      
      if (seriesName) {
        url += `&seriesName=${seriesName}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching blindbox series:', error);
      throw error;
    }
  },
  
  getBlindboxSeriesById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blindbox/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching blindbox series with ID ${id}:`, error);
      throw error;
    }
  }
};

export default blindboxService;