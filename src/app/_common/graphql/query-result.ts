import { action, computed, makeObservable, observable } from 'mobx';
import { ApolloClient } from 'apollo-client-preset';
import { WatchQueryOptions } from 'apollo-client/core/watchQueryOptions';

export class QueryResult<RESULT, VARIABLES> {
  private subscription?: ReturnType<typeof apolloQueryToMobxObservable>['subscription'];
  private queryWatcher?: ReturnType<typeof apolloQueryToMobxObservable>['queryWatcher'];
  private queryOptions: WatchQueryOptions<VARIABLES> | null = null;

  constructor(private client: ApolloClient<{}>) {
    makeObservable(this, {
      // @ts-ignore
      result: computed,
      error: computed,
      loading: computed,
      data: computed,
      query: action,
      queryOptions: observable.ref,
    });
  }

  private get result() {
    this.subscription?.unsubscribe();
    if (this.queryOptions) {
      const { result, subscription, queryWatcher } = apolloQueryToMobxObservable(this.client, this.queryOptions);
      this.subscription = subscription;
      // @ts-ignore
      this.queryWatcher = queryWatcher;
      return result;
    } else {
      return observable({
        error: null,
        loading: false,
        data: null,
      });
    }
  }

  get error(): string | null {
    return (this.result.error && this.result.error.message) || null;
  }

  get loading(): boolean {
    return this.result.loading;
  }

  get data(): RESULT | null {
    return this.result.data;
  }

  query(queryOptions: WatchQueryOptions<VARIABLES>) {
    this.queryOptions = queryOptions;
  }

  dispose() {
    this.subscription?.unsubscribe();
  }
}

function apolloQueryToMobxObservable<VARIABLES>(client: ApolloClient<{}>, queryOptions: WatchQueryOptions<VARIABLES>) {
  const queryWatcher = client.watchQuery(queryOptions);
  const result = observable(queryWatcher.currentResult());

  const subscription = queryWatcher.subscribe({
    next: action((value) => {
      result.error = undefined;
      result.loading = value.loading;
      result.data = value.data;
    }),
    error: action((error) => {
      result.error = error;
      result.loading = false;
      result.data = undefined;
    }),
  });
  return { result, subscription, queryWatcher };
}
