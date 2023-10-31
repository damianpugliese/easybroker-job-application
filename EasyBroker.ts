import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface IEasyBroker {
  getProperties(page: number, limit: number): Promise<PropertiesResponse>;
  getAllProperties(limit: number): Promise<Property[] | undefined>;
  printPropertiesTitle(properties: Property[] | undefined): void;
}

interface Pagination {
  limit: number;
  page: number;
  total: number;
}

interface Property {
  title: string;
}

interface PropertiesResponse {
  pagination: Pagination;
  content: Property[];
}

export class EasyBroker implements IEasyBroker {
  private axiosInstance: AxiosInstance;

  constructor(apiKey: string | undefined) {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('API key is required and cannot be undefined or an empty string.');
    }

    this.axiosInstance = axios.create({
      baseURL: 'https://api.stagingeb.com/v1',
      headers: {
        'X-Authorization': apiKey,
      },
    });
  }

  /**
   * Get properties from EasyBroker API
   * @param {number} page - Page number
   * @param {number} limit - Limit of properties per page
   * @returns {Promise<PropertiesResponse>} - Promise with the response from the API
   * @throws {Error} - When an error ocurred getting the properties from certain page
   */
  async getProperties(page: number = 1, limit: number = 20): Promise<PropertiesResponse> {
    try {
      console.log(`Getting properties from page: ${page}`)
      const response: AxiosResponse = await this.axiosInstance.get('/properties', {
        params: {
          page,
          limit,
        },
      });
  
      return response.data;
    } catch (error) {
      throw new Error(`An error ocurred getting the properties from page: ${page}`);
    }
  };

  /**
   * Get all properties from EasyBroker API
   * @param {number} limit - Limit of properties per page
   * @returns {Promise<Property[]>} - Promise with the response from the API
   * @throws {Error} - When an error ocurred getting the properties from certain page
   */
  async getAllProperties(limit: number = 20): Promise<Property[]> {
    try {
      let page = 1;
      let totalProperties = 0;
      const allProperties: Array<Property> = [];
            
      do {
        const properties = await this.getProperties(page, limit);

        allProperties.push(...properties.content);
                  
        const { pagination } = properties;
        totalProperties = pagination.total;

        page++;
      } while (totalProperties > 0 && (page - 1) * limit < totalProperties);

      return allProperties;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  /**
   * Print the properties title
   * @param {Property[]} properties - Properties
   */
  printPropertiesTitle(properties: Property[]): void {
    properties.forEach((prop) => {
      console.log(`Property title: ${prop.title}`);
    });
  }
};
