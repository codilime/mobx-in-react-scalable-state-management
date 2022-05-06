import axios from 'axios';
import { ajax } from 'rxjs/ajax';
import { Observable } from 'rxjs';

const BASE_URL = '/api';

export class HttpClientService {
  // You may want to configure interceptors here for Authorization: "Bearer ..."
  private axiosInstance = axios.create({ baseURL: BASE_URL });

  get$<RES>(path: string): Observable<RES> {
    return ajax.getJSON(BASE_URL + path);
  }

  async get<RES, REQ = unknown>(path: string, request?: REQ): Promise<RES> {
    return this.axiosInstance
      .get(path, { params: request })
      .then((r) => r.data);
  }

  async post<RES, REQ = unknown>(path: string, request: REQ): Promise<RES> {
    return this.axiosInstance.post(path, request).then((r) => r.data);
  }

  async put<RES, REQ = unknown>(path: string, request: REQ): Promise<RES> {
    return this.axiosInstance.put(path, request).then((r) => r.data);
  }

  async delete<RES = unknown>(path: string): Promise<RES> {
    return this.axiosInstance.delete(path).then((r) => r.data);
  }

  //... other HTTP methods
}
