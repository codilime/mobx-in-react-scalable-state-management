import { action, computed, makeObservable } from 'mobx';
import { GraphqlBaseDataStore } from '@/app/_common/graphql/graphql-base.data-store';
import { CreateUser, GetAllUsers } from '@/app/users/_common/stores/users.queries';
import {
  CreateUserMutation,
  CreateUserMutationVariables,
  GetAllUsersQuery,
  GetAllUsersQueryVariables,
} from '@/generated/graphql';

export class UsersDataStore extends GraphqlBaseDataStore<GetAllUsersQuery, GetAllUsersQueryVariables> {
  get users() {
    return this.data?.allUsers;
  }

  constructor() {
    super();
    makeObservable(this, { users: computed, create: action });
    this.read();
  }

  read() {
    this.query({ query: GetAllUsers, fetchPolicy: 'cache-and-network' });
  }

  async create(variables: CreateUserMutationVariables) {
    try {
      await this.mutate<CreateUserMutation, CreateUserMutationVariables>({
        mutation: CreateUser,
        variables: variables,
        refetchQueries: [{ query: GetAllUsers }],
      });
    } catch (e) {
      console.error(e);
    }
  }
}
