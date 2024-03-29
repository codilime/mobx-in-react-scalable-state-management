import { HttpClientService } from '@/app/_common/http/http-client.service';
import {
  DeleteUsersRequestJTO,
  GetUsersResponseJTO,
  PostUserRequestJTO,
  PostUserResponseJTO,
} from '@/app/users/_common/remote-api/jto/users.jto';

export class UsersHttpService {
  private httpClient = new HttpClientService();

  async getUsers() {
    return this.httpClient.get<GetUsersResponseJTO>('/users');
  }

  async postUser(user: PostUserRequestJTO) {
    return this.httpClient.post<PostUserResponseJTO>('/users', user);
  }

  async deleteUsers({ ids }: DeleteUsersRequestJTO) {
    return this.httpClient.delete(`/users?ids=${ids.join(',')}`);
  }
}
