import { injectClass } from '@/app/_common/ioc/inject-class';
import { GraphqlClient } from '@/app/_common/graphql/graphql-client';
import { WatchQueryOptions } from 'apollo-client/core/watchQueryOptions';
import { computed, makeObservable } from 'mobx';
import { QueryResult } from '@/app/_common/graphql/query-result';

export class GraphqlBaseDataStore<RESULT, VARIABLES> {
  protected client = injectClass(this, GraphqlClient);

  protected result: QueryResult<RESULT, VARIABLES> = new QueryResult<RESULT, VARIABLES>(this.client, this.queryOptions);

  get loading() {
    return this.result.loading;
  }

  get error() {
    return this.result.error;
  }

  constructor(private queryOptions: WatchQueryOptions<VARIABLES>) {
    makeObservable(
      this,
      {
        loading: computed,
        error: computed,
      },
      { autoBind: true },
    );
  }

  dispose() {
    this.result?.dispose();
  }
}
