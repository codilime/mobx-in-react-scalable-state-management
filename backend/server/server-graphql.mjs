import { ApolloServer } from 'apollo-server';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import { resolve } from 'path';
import { serverState } from './server-state.mjs';

const typeDefs = mergeTypes(fileLoader(resolve('./backend/schema')));

const resolvers = {
  Query: {
    me: () => serverState.users[0],
    dashboard: () => serverState.dashboards[0],
    allUsers: () => serverState.users,
    allDashboards: () => serverState.dashboards,
  },
  Mutation: {
    createUser: (parent, user) => {
      const newUser = { ...user, id: serverState.nextUserId() };
      serverState.users.push(newUser);
      return newUser;
    },
    deleteUsers: (parent, { ids }) => {
      serverState.users = serverState.users.filter((user) => !ids.includes(user.id.toString()));
      return true;
    },
  },
  Dashboard: {
    owner: (parent) => serverState.users.find((user) => user.id === parent.ownedBy),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 GraphQL Server ready at ${url}`);
});
