import { injectClass } from '@/app/_common/ioc/inject-class';
import { GraphqlClient } from '@/app/_common/graphql/graphql-client';
import { MutationOptions, WatchQueryOptions } from 'apollo-client/core/watchQueryOptions';
import { computed, makeObservable } from 'mobx';
import { QueryResult } from '@/app/_common/graphql/query-result';

export class GraphqlBaseDataStore<QUERY_RESULT, QUERY_VARIABLES> {
  private client = injectClass(this, GraphqlClient);

  private state = {
    result: new QueryResult<QUERY_RESULT, QUERY_VARIABLES>(this.client),
  };

  constructor() {
    makeObservable(this, { loading: computed, error: computed, data: computed }, { autoBind: true });
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
    this.state.result.query(queryOptions);
  }

  protected async mutate<MUTATION_RESULT, MUTATION_VARIABLES>(
    options: MutationOptions<MUTATION_RESULT, MUTATION_VARIABLES>,
  ) {
    return await this.client.mutate(options);
  }

  dispose() {
    this.state.result?.dispose();
  }
}
