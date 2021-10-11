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
    return this.result.data?.allUsers;
  }

  constructor() {
    super({ query: GetAllUsers });
    makeObservable(this, {
      users: computed,
      create: action,
    });
  }

  async create(user: CreateUserMutationVariables) {
    try {
      await this.client.mutate<CreateUserMutation, CreateUserMutationVariables>({
        mutation: CreateUser,
        variables: user,
        refetchQueries: [{ query: GetAllUsers }],
      });
    } catch (e) {
      console.error(e);
    }
  }
}
