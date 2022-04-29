import { makeAutoObservable } from 'mobx';

const DEFAULT_STATE = {
  opened: false,
  data: null,
};

export class ModalState<DATA> {
  private readonly state!: State<DATA>;

  constructor(initialState: Partial<State<DATA>> = {}) {
    this.state = Object.assign({}, DEFAULT_STATE, initialState);
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  get opened() {
    return this.state.opened;
  }

  get data() {
    return this.state.data;
  }

  open(data: State<DATA>['data'] = null) {
    this.state.opened = true;
    this.state.data = data;
  }

  close() {
    this.state.opened = false;
    this.state.data = null;
  }
}

interface State<DATA> {
  data: DATA | null;
  opened: boolean;
}
