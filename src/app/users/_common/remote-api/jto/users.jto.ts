import { User } from '@/generated/graphql';

export type UserJTO = Omit<User, '__typename'>;

export type GetUsersResponseJTO = Array<UserJTO>;

export type PostUserRequestJTO = Omit<UserJTO, 'id'>;
export type PostUserResponseJTO = UserJTO;

export type PutUserRequestJTO = UserJTO;
export type PutUserResponseJTO = UserJTO;

export type DeleteUsersRequestJTO = { ids: Array<string> };
