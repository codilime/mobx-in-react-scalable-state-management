import { HttpClientService } from '@/app/_common/http/http-client.service';
import {
  GetUserDetailsRequestJTO,
  GetUserDetailsResponseJTO,
  GetUsersResponseJTO,
} from '@/app/users/_common/remote-api/jto/users.jto';

export class UsersHttpService {
  private httpClient = new HttpClientService();

  getUsers() {
    return this.httpClient.get<GetUsersResponseJTO>('/users');
  }

  getUserDetails(userId: GetUserDetailsRequestJTO) {
    return this.httpClient.get<GetUserDetailsResponseJTO>(
      '/users/' + userId + '/details',
    );
  }

  getUserDetails$(userId: GetUserDetailsRequestJTO) {
    return this.httpClient.get$<GetUserDetailsResponseJTO>(
      '/users/' + userId + '/details',
    );
  }
}
