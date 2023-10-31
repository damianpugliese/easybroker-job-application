import { EasyBroker } from './EasyBroker';
import nock from 'nock';
import dotenv from "dotenv";
dotenv.config();

describe('EasyBroker', () => {
  beforeEach(() => {
    nock.cleanAll();
    jest.spyOn(console, 'log').mockReset();
    jest.spyOn(console, 'error').mockReset();
  });

  const apiKey = process.env.API_KEY;
  const limit = 2;
  const easyBroker = new EasyBroker(apiKey);
  const consoleLogSpy = jest.spyOn(console, 'log');

  describe('When API key is undefined or an empty string', () => {
    it('should throw an error', async () => {
      expect(() => new EasyBroker('')).toThrowError('API key is required and cannot be undefined or an empty string.');
      expect(() => new EasyBroker(undefined)).toThrowError('API key is required and cannot be undefined or an empty string.');
    });
  });

  describe('getProperties method', () => {
    describe('When the API responds successfully', () => {
      it('should return the properties corresponding to the page and limit', async () => {
        nock('https://api.stagingeb.com/v1')
          .get('/properties')
          .query({
            page: 1,
            limit,
          })
          .reply(200, {
            pagination: {
              total: 2,
            },
            content: [
              {
                title: 'Property 1',
              },
              {
                title: 'Property 2',
              },
            ],
          });
    
        const properties = await easyBroker.getProperties(1, limit);
    
        expect(properties).toEqual({
          pagination: {
            total: 2,
          },
          content: [
            {
              title: 'Property 1',
            },
            {
              title: 'Property 2',
            },
          ],
        });
      });
    });
  
    describe('When the API responds with an error', () => {
      it('should throw an error', async () => {
        nock('https://api.stagingeb.com/v1')
          .get('/properties')
          .query({
            page: 1,
            limit,
          })
          .reply(500);
    
        await expect(easyBroker.getProperties(1, limit)).rejects.toThrowError('An error ocurred getting the properties from page: 1');
      });
    });
  });

  describe('getAllProperties method', () => {
    describe('When the API responds successfully', () => {
      it('should return all properties', async () => {
        nock('https://api.stagingeb.com/v1')
          .get('/properties')
          .query({
            page: 1,
            limit,
          })
          .reply(200, {
            pagination: {
              total: 4,
            },
            content: [
              {
                title: 'Property 1',
              },
              {
                title: 'Property 2',
              },
            ],
          });

        nock('https://api.stagingeb.com/v1')
          .get('/properties')
          .query({
            page: 2,
            limit,
          })
          .reply(200, {
            pagination: {
              total: 4,
            },
            content: [
              {
                title: 'Property 3',
              },
              {
                title: 'Property 4',
              },
            ],
          });
    
        const properties = await easyBroker.getAllProperties(limit);
    
        expect(properties).toEqual([
          {
            title: 'Property 1',
          },
          {
            title: 'Property 2',
          },
          {
            title: 'Property 3',
          },
          {
            title: 'Property 4',
          },
        ]);
      });
    });
  
    describe('When the API responds with an error', () => {
      it('should throw an error', async () => {
        nock('https://api.stagingeb.com/v1')
          .get('/properties')
          .query({
            page: 1,
            limit,
          })
          .reply(200, {
            pagination: {
              total: 4,
            },
            content: [
              {
                title: 'Property 1',
              },
              {
                title: 'Property 2',
              },
            ],
          });

        nock('https://api.stagingeb.com/v1')
          .get('/properties')
          .query({
            page: 2,
            limit,
          })
          .reply(500);
    
        await expect(easyBroker.getAllProperties(limit)).rejects.toThrowError('An error ocurred getting the properties from page: 2');
      });
    });
  });

  describe('printPropertiesTitle method', () => {
    it('should print the properties title', async () => {
      const properties = [
        {
          title: 'Property 1',
        },
        {
          title: 'Property 2',
        },
      ];
    
      easyBroker.printPropertiesTitle(properties);
    
      expect(consoleLogSpy).toHaveBeenCalledWith('Property title: Property 1');
      expect(consoleLogSpy).toHaveBeenCalledWith('Property title: Property 2');
    });
  });
});
