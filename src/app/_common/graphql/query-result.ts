import { action, makeAutoObservable, observable } from 'mobx';
import { ApolloClient } from 'apollo-client-preset';
import { WatchQueryOptions } from 'apollo-client/core/watchQueryOptions';

export class QueryResult<RESULT, VARIABLES> {
  private subscription?: ReturnType<typeof apolloQueryToMobxObservable>['subscription'];

  constructor(
    private client: ApolloClient<{}>,
    private queryOptions: Omit<WatchQueryOptions<VARIABLES>, 'variables'>,
    private variables?: VARIABLES,
  ) {
    makeAutoObservable(this, {
      // @ts-ignore
      client: false,
      queryOptions: false,
    });
  }

  private get result() {
    this.subscription?.unsubscribe();
    const { result, subscription } = apolloQueryToMobxObservable(this.client, this.queryOptions, this.variables);
    this.subscription = subscription;
    return result;
  }

  get error(): string | null {
    return (this.result.error && this.result.error.message) || null;
  }

  get loading(): boolean {
    return this.result.loading;
  }

  get data(): RESULT {
    return this.result.data;
  }

  setVariables(variables: VARIABLES | undefined) {
    this.variables = variables;
  }

  dispose() {
    this.subscription?.unsubscribe();
  }
}

function apolloQueryToMobxObservable<VARIABLES>(
  client: ApolloClient<{}>,
  queryOptions: Omit<WatchQueryOptions<VARIABLES>, 'variables'>,
  variables: VARIABLES | undefined,
) {
  const query = client.watchQuery({ ...queryOptions, variables });
  const result = observable(query.currentResult());

  const subscription = query.subscribe({
    next: action(function (value) {
      result.error = undefined;
      result.loading = value.loading;
      result.data = value.data;
    }),
    error: action(function (error) {
      result.error = error;
      result.loading = false;
      result.data = undefined;
    }),
  });
  return { result, subscription, query };
}
