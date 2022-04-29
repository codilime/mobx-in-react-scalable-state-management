import { makeAutoObservable } from 'mobx';
import { getErrorMessage } from '../utils/get-error-message';

export enum AsyncStatus {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

const DEFAULT_STATE = {
  isPristine: true,
  status: AsyncStatus.IDLE,
  errorMessage: '',
};

export class AsyncState {
  private readonly state!: State;

  constructor(initialState: Partial<State> = {}) {
    this.state = Object.assign({}, DEFAULT_STATE, initialState);
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  get isPristine() {
    return this.state.isPristine;
  }

  get status() {
    return this.state.status;
  }

  get errorMessage() {
    return this.state.errorMessage;
  }

  get isPending() {
    return this.status === AsyncStatus.PENDING;
  }

  get isIdle() {
    return this.status === AsyncStatus.IDLE;
  }

  get isLoading() {
    return this.isIdle || this.isPending;
  }

  get isResolved() {
    return this.status === AsyncStatus.RESOLVED;
  }

  get isRejected() {
    return this.status === AsyncStatus.REJECTED;
  }

  get isReloading() {
    return !this.isPristine && this.isPending;
  }

  idle() {
    this.state.status = AsyncStatus.IDLE;
    this.state.errorMessage = '';
  }

  invoke() {
    this.state.status = AsyncStatus.PENDING;
    this.state.errorMessage = '';
  }

  resolve() {
    this.state.isPristine = false;
    this.state.status = AsyncStatus.RESOLVED;
    this.state.errorMessage = '';
  }

  reject(error: unknown) {
    this.state.status = AsyncStatus.REJECTED;
    this.state.errorMessage = getErrorMessage(error);
  }
}

type State = {
  isPristine: boolean;
  status: AsyncStatus;
  errorMessage: string;
};
