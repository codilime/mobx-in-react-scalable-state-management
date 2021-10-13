import { action, computed, makeObservable } from 'mobx';
import { GraphqlBaseDataStore } from '@/app/_common/graphql/graphql-base.data-store';
import { CreateUser, DeleteUsers, GetAllUsers } from '@/app/users/_common/stores/users.queries';
import {
  CreateUserMutation,
  CreateUserMutationVariables,
  GetAllUsersQuery,
  GetAllUsersQueryVariables,
  DeleteUsersMutation,
  DeleteUsersMutationVariables,
} from '@/generated/graphql';

export class UsersDataStore extends GraphqlBaseDataStore<GetAllUsersQuery, GetAllUsersQueryVariables> {
  constructor() {
    super();
    makeObservable(this, { users: computed, create: action });
    this.read();
  }

  get users() {
    return this.data?.allUsers;
  }

  read() {
    this.query({ query: GetAllUsers, fetchPolicy: 'cache-and-network' });
  }

  async create(variables: CreateUserMutationVariables) {
    try {
      await this.mutate<CreateUserMutation, CreateUserMutationVariables>({
        mutation: CreateUser,
        variables,
        refetchQueries: [{ query: GetAllUsers }],
      });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async delete(variables: DeleteUsersMutationVariables) {
    try {
      return await this.mutate<DeleteUsersMutation, DeleteUsersMutationVariables>({
        mutation: DeleteUsers,
        variables,
        refetchQueries: [{ query: GetAllUsers }],
      });
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
