import blindboxService from '../../data/services/blindboxService';

class BlindboxFacade {
  async getBlindboxSeries(page = 0, size = 20, sort = ['id', 'asc'], seriesName = null) {
    try {
      const response = await blindboxService.getBlindboxSeries(page, size, sort, seriesName);
      console.log('Raw response from getBlindboxSeries:', response);
      
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
      console.log('Raw response from getBlindboxSeriesById:', response);
      
      if (!response) {
        throw new Error('No response received from API');
      }

      if ('status' in response) {
        if (!response.status) {
          throw new Error(response.message || `Failed to fetch blindbox series with ID ${id}`);
        }
        return response.metadata;
      }

      return response;
    } catch (error) {
      console.error(`Error in BlindboxFacade.getBlindboxSeriesById for ID ${id}:`, error);
      throw error;
    }
  }

  // New method to fetch customer's purchase history for a specific product
  async getCustomerPurchaseCount(productId, customerId) {
    try {
      // Assuming the backend has an endpoint to fetch the customer's purchase count for a product
      const response = await blindboxService.getCustomerPurchaseCount(productId, customerId);
      console.log('Raw response from getCustomerPurchaseCount:', response);

      if (!response) {
        throw new Error('No response received from API');
      }

      if ('status' in response) {
        if (!response.status) {
          throw new Error(response.message || `Failed to fetch purchase count for product ID ${productId}`);
        }
        return response.metadata.count || 0; // Assuming the response has a count field
      }

      return response.count || 0;
    } catch (error) {
      console.error(`Error in BlindboxFacade.getCustomerPurchaseCount for product ID ${productId}:`, error);
      return 0; // Return 0 if there's an error
    }
  }
}

export default new BlindboxFacade();