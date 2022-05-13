import { runInAction } from 'mobx';
import { toStream } from 'mobx-utils';
import { retry, tap } from 'rxjs/operators';
import { from, Observable, ObservableInput, switchMap, timer } from 'rxjs';
import { AsyncState } from '@/app/_common/stores/async.state';

export function subscribeAsyncReader<RESPONSE, REQUEST = unknown>({
  asyncState,
  request,
  read,
  onSuccess,
}: {
  asyncState: AsyncState;
  request: () => REQUEST;
  read: (request: REQUEST) => Observable<RESPONSE>;
  onSuccess: (response: RESPONSE) => void;
}) {
  return from(toStream(request, true) as ObservableInput<REQUEST>)
    .pipe(
      tap(() => asyncState.invoke()),
      switchMap(read),
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
