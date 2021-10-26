import { isEmpty, isNil } from 'lodash';
import remotedev from 'mobx-remotedev';
import { injectInterface } from '@/app/_common/ioc/inject-interface';
import { GraphqlClient } from '@/app/_common/graphql/graphql-client';
import { action, computed, makeObservable, observable } from 'mobx';
import { ApolloCurrentResult, MutationOptions, ObservableQuery, WatchQueryOptions } from 'apollo-client';

export class GraphqlBaseDataStore<QUERY_RESULT, QUERY_VARIABLES> {
  private readonly client!: GraphqlClient;
  private queryWatcher?: ObservableQuery<QUERY_RESULT, QUERY_VARIABLES>;
  private subscription?: ZenObservable.Subscription;

  private result: Result<QUERY_RESULT> = {
    loading: false,
    error: undefined,
    data: undefined,
  };

  constructor() {
    // Do not show client in Redux DevTools
    Object.defineProperty(this, 'client', {
      value: injectInterface(this, GraphqlClient),
      enumerable: false,
    });

    makeObservable(
      this,
      {
        loading: computed,
        error: computed,
        data: computed,
        // @ts-ignore - for protected/private fields
        result: observable,
        query: action,
        onSuccess: action,
        onFailure: action,
      },
      { autoBind: true },
    );
    remotedev(this, { name: this.constructor.name });
  }

  get loading() {
    return this.result.loading;
  }

  get error() {
    return this.result.error;
  }

  get data() {
    return this.result.data;
  }

  protected query(queryOptions: WatchQueryOptions<QUERY_VARIABLES>) {
    this.subscription?.unsubscribe();

    // Do not show queryWatcher in Redux DevTools
    Object.defineProperty(this, 'queryWatcher', {
      value: this.client.watchQuery(queryOptions),
      enumerable: false,
    });
    assertValue(this.queryWatcher);

    const currentResult = observable(this.queryWatcher.currentResult());
    this.result.loading = currentResult.loading;
    this.result.error = currentResult.error;
    this.result.data = isEmpty(currentResult.data) ? undefined : (currentResult.data as QUERY_RESULT);

    // Do not show subscription in Redux DevTools
    Object.defineProperty(this, 'subscription', {
      value: this.queryWatcher.subscribe({
        next: (value) => this.onSuccess(value.data, value.loading),
        error: (error) => this.onFailure(error),
      }),
      enumerable: false,
    });
  }

  protected async mutate<MUTATION_RESULT, MUTATION_VARIABLES>(
    options: MutationOptions<MUTATION_RESULT, MUTATION_VARIABLES>,
  ) {
    return await this.client.mutate(options);
  }

  private onSuccess(data: QUERY_RESULT, loading: boolean) {
    this.result.error = undefined;
    this.result.loading = loading;
    this.result.data = data;
  }

  private onFailure(error: Result<QUERY_RESULT>['error']) {
    this.result.error = error;
    this.result.loading = false;
    this.result.data = undefined;
  }

  dispose() {
    this.subscription?.unsubscribe();
  }
}

interface Result<QUERY_RESULT> {
  loading: boolean;
  error?: ApolloCurrentResult<QUERY_RESULT>['error'];
  data?: QUERY_RESULT;
}

function assertValue(value: unknown): asserts value {
  if (isNil(value)) throw new Error('Value is invalid');
}
