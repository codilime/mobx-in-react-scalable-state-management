import { action, makeAutoObservable, observable } from 'mobx';
import { ApolloClient } from 'apollo-client-preset';
import { WatchQueryOptions } from 'apollo-client/core/watchQueryOptions';

export class QueryResult<RESULT, VARIABLES> {
  private subscription: ReturnType<typeof apolloQueryToMobxObservable>['subscription'] | undefined;

  private get result() {
    this.subscription?.unsubscribe();
    const { result, subscription } = apolloQueryToMobxObservable(this.client, this.queryOptions);
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

  constructor(private client: ApolloClient<{}>, private queryOptions: WatchQueryOptions<VARIABLES>) {
    makeAutoObservable(this, {
      // @ts-ignore
      client: false,
      query: false,
    });
  }

  dispose() {
    this.subscription?.unsubscribe();
  }
}

function apolloQueryToMobxObservable<VARIABLES>(client: ApolloClient<{}>, queryOptions: WatchQueryOptions<VARIABLES>) {
  const query = client.watchQuery(queryOptions);
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
