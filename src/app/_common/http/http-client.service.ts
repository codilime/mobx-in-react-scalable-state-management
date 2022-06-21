import axios from 'axios';
import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';

const BASE_URL = '/api';

export class HttpClientService {
  // You may want to configure interceptors here for Authorization: "Bearer ..."
  private axiosInstance = axios.create({ baseURL: BASE_URL });

  async get<RES, REQ = unknown>(path: string, request?: REQ): Promise<RES> {
    return this.axiosInstance
      .get(path, { params: request })
      .then((r) => r.data);
  }

  get$<RES>(path: string): Observable<RES> {
    return ajax.getJSON(BASE_URL + path);
  }

  //... other HTTP methods
}
