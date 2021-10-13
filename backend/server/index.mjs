import { ApolloServer } from 'apollo-server';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import { resolve } from 'path';

const typeDefs = mergeTypes(fileLoader(resolve('./backend/schema')));

let users = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@foo.local' },
  { id: 2, firstName: 'Mary', lastName: 'Smith', email: 'mary.smith@foo.local' },
];

const dashboards = [
  {
    id: 1,
    ownedBy: users[0].id,
    name: 'Home Dashboard',
  },
  {
    id: 2,
    ownedBy: users[1].id,
    name: 'Home Dashboard',
  },
];

const resolvers = {
  Query: {
    me: () => users[0],
    dashboard: () => dashboards[0],
    allUsers: () => users,
    allDashboards: () => dashboards,
  },
  Mutation: {
    createUser: (parent, user) => {
      const newUser = { ...user, id: users.length + 1 };
      users.push(newUser);
      return newUser;
    },
    deleteUsers: (parent, { ids }) => {
      users = users.filter((user) => !ids.includes(user.id.toString()));
      return true;
    },
  },
  Dashboard: {
    owner: (parent) => users.find((user) => user.id === parent.ownedBy),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
