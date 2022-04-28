import { makeAutoObservable } from 'mobx';

export class ModalState<DATA> {
  readonly state!: State<DATA>;

  constructor(state: State<DATA> = { data: null, opened: false }) {
    this.state = state;
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
