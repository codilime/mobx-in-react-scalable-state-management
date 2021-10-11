import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset';

export class GraphqlClient extends ApolloClient<{}> {
  constructor() {
    super({
      link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
      cache: new InMemoryCache(),
    });
  }
}
