export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Dashboard = {
  __typename?: 'Dashboard';
  id: Scalars['ID'];
  name: Scalars['String'];
  owner: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: User;
  deleteUsers?: Maybe<Scalars['Boolean']>;
};


export type MutationCreateUserArgs = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};


export type MutationDeleteUsersArgs = {
  ids: Array<Scalars['ID']>;
};

export type Query = {
  __typename?: 'Query';
  allDashboards: Array<Dashboard>;
  allUsers: Array<User>;
  dashboard: Dashboard;
  me: User;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
};

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', allUsers: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, email: string }> };

export type CreateUserMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string } };

export type DeleteUsersMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type DeleteUsersMutation = { __typename?: 'Mutation', deleteUsers?: boolean | null };
