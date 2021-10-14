import { isEmpty, isNil } from 'lodash';
import remotedev from 'mobx-remotedev';
import { injectClass } from '@/app/_common/ioc/inject-class';
import { GraphqlClient } from '@/app/_common/graphql/graphql-client';
import { action, computed, makeObservable, observable } from 'mobx';
import { ApolloCurrentResult, MutationOptions, ObservableQuery, WatchQueryOptions } from 'apollo-client';

export class GraphqlBaseDataStore<QUERY_RESULT, QUERY_VARIABLES> {
  private readonly client!: GraphqlClient;
  private queryWatcher?: ObservableQuery<QUERY_RESULT, QUERY_VARIABLES>;
  private subscription?: ZenObservable.Subscription;

  private state: State<QUERY_RESULT> = {
    result: {
      loading: false,
      error: undefined,
      data: undefined,
    },
  };

  constructor() {
    // Do not show client in Redux DevTools
    Object.defineProperty(this, 'client', {
      value: injectClass(this, GraphqlClient),
      enumerable: false,
    });
    makeObservable(
      this,
      {
        loading: computed,
        error: computed,
        data: computed,
        // @ts-ignore
        state: observable,
        query: action,
        onSuccess: action,
        onFailure: action,
      },
      { autoBind: true },
    );
    remotedev(this, { name: this.constructor.name });
  }

  get loading() {
    return this.state.result.loading;
  }

  get error() {
    return this.state.result.error;
  }

  get data() {
    return this.state.result.data;
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
    this.state.result.loading = currentResult.loading;
    this.state.result.error = currentResult.error;
    this.state.result.data = isEmpty(currentResult.data) ? undefined : (currentResult.data as QUERY_RESULT);

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
    this.state.result.error = undefined;
    this.state.result.loading = loading;
    this.state.result.data = data;
  }

  private onFailure(error: State<QUERY_RESULT>['result']['error']) {
    this.state.result.error = error;
    this.state.result.loading = false;
    this.state.result.data = undefined;
  }

  dispose() {
    this.subscription?.unsubscribe();
  }
}

interface State<QUERY_RESULT> {
  result: {
    loading: boolean;
    error?: ApolloCurrentResult<QUERY_RESULT>['error'];
    data?: QUERY_RESULT;
  };
}

function assertValue(value: unknown): asserts value {
  if (isNil(value)) throw new Error('Value is invalid');
}
