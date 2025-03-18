import blindboxService from '../../data/services/blindboxService';

class BlindboxFacade {
  async getBlindboxSeries(page = 0, size = 20, sort = ['id', 'asc'], seriesName = null) {
    try {
      const response = await blindboxService.getBlindboxSeries(page, size, sort, seriesName);
      
      if (!response.status) {
        throw new Error(response.message || 'Failed to fetch blindbox series');
      }
      
      return response.metadata;
    } catch (error) {
      console.error('Error in BlindboxFacade.getBlindboxSeries:', error);
      throw error;
    }
  }
  
  async getBlindboxSeriesById(id) {
    try {
      const response = await blindboxService.getBlindboxSeriesById(id);
      
      if (!response.status) {
        throw new Error(response.message || `Failed to fetch blindbox series with ID ${id}`);
      }
      
      return response.metadata;
    } catch (error) {
      console.error(`Error in BlindboxFacade.getBlindboxSeriesById for ID ${id}:`, error);
      throw error;
    }
  }
}

export default new BlindboxFacade();