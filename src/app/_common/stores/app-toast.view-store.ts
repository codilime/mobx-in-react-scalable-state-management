import { makeAutoObservable } from 'mobx';
import { AlertColor } from '@mui/material/Alert/Alert';

export class AppToastViewStore {
  private state: State = {
    opened: false,
    message: '',
    severity: 'info',
  };

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  get opened() {
    return this.state.opened;
  }

  get message() {
    return this.state.message;
  }

  get severity() {
    return this.state.severity;
  }

  open(message: State['message'], severity: State['severity'] = 'info') {
    this.state.opened = true;
    this.state.message = message;
    this.state.severity = severity;
  }

  close() {
    this.state.opened = false;
  }
}

interface State {
  opened: boolean;
  message: string;
  severity: AlertColor;
}
