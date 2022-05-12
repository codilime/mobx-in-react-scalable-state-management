import { AsyncState } from '@/app/_common/stores/async.state';
import { from, Observable, ObservableInput, switchMap, timer } from 'rxjs';
import { toStream } from 'mobx-utils';
import { retry, tap } from 'rxjs/operators';
import { runInAction } from 'mobx';

export function subscribeAsyncReader<RESPONSE, REQUEST = unknown>({
  request,
  asyncState,
  onSuccess,
  onReadData,
}: {
  request: () => REQUEST;
  asyncState: AsyncState;
  onSuccess: (response: RESPONSE) => void;
  onReadData: (request: REQUEST) => Observable<RESPONSE>;
}) {
  return from(toStream(request, true) as ObservableInput<REQUEST>)
    .pipe(
      tap(() => asyncState.invoke()),
      switchMap(onReadData),
      tap((response) => {
        runInAction(() => {
          onSuccess(response);
          asyncState.resolve();
        });
      }),
      retry({
        delay: (error, retryCount) => {
          asyncState.reject(error);
          return timer(2000);
        },
      }),
    )
    .subscribe();
}
