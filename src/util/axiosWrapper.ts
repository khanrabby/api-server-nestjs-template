import axios from 'axios';

export default class AxiosWrapper {
  private readonly _axios: any;

  constructor(baseUrl: string) {
    this._axios = axios.create({
      'baseURL': baseUrl,
      'timeout': 5000,
      'headers': {
        'Content-Type': 'application/json'
      }
    });
  }

  async setAccessToken(accessToken: string) {
    this._axios.interceptors.request.use((config: any) => {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    });
  }

  async get(getUrl: string): Promise<any> {
    return await new Promise((resolve: any, reject: any) => {
      this._axios
        .get(getUrl)
        .then((result: any) => {
          resolve(result);
        })
        .catch((error: any) => {
          console.error(error.toString());
          reject(error);
        });
    });
  }

  async getWithBasicAuth(getUrl: string, auth : any) : Promise<any>{
    return await new Promise((resolve: any, reject: any) => {
      this._axios
        .get(getUrl, {auth : auth})
        .then((result: any) => {
          resolve(result.data);
        })
        .catch((error: any) => {
          console.error(error.toString());
          reject(error);
        });
    });
  }
}