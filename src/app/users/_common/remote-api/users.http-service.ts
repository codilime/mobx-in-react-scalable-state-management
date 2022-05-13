import { HttpClientService } from '@/app/_common/http/http-client.service';
import {
  DeleteUsersRequestJTO,
  GetUserDetailsRequestJTO,
  GetUserDetailsResponseJTO,
  GetUsersResponseJTO,
  PostUserRequestJTO,
  PostUserResponseJTO,
  PutUserRequestJTO,
  PutUserResponseJTO,
} from '@/app/users/_common/remote-api/jto/users.jto';

export class UsersHttpService {
  private httpClient = new HttpClientService();

  getUserDetails$(userId: GetUserDetailsRequestJTO) {
    return this.httpClient.get$<GetUserDetailsResponseJTO>(
      '/users/' + userId + '/details',
    );
  }

  getUsers$() {
    return this.httpClient.get$<GetUsersResponseJTO>('/users');
  }

  async postUser(user: PostUserRequestJTO) {
    return this.httpClient.post<PostUserResponseJTO>('/users', user);
  }

  async putUser(user: PutUserRequestJTO) {
    return this.httpClient.put<PutUserResponseJTO>('/users/' + user.id, user);
  }

  async deleteUsers({ ids }: DeleteUsersRequestJTO) {
    return this.httpClient.delete(`/users?ids=${ids.join(',')}`);
  }
}
