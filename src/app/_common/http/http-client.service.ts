import axios from 'axios';

const BASE_URL = '/api';

export class HttpClientService {
  // You may want to configure interceptors here for Authorization: "Bearer ..."
  private axiosInstance = axios.create({ baseURL: BASE_URL });

  async get<RES, REQ = unknown>(path: string, request?: REQ): Promise<RES> {
    return this.axiosInstance
      .get(path, { params: request })
      .then((r) => r.data);
  }

  //... other HTTP methods
}
