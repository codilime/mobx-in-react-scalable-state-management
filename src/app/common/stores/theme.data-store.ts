import { makeAutoObservable } from 'mobx';
import { makePersistable, stopPersisting } from 'mobx-persist-store';

export class ThemeDataStore {
  private state: State = {
    theme: 'dark',
  };

  get theme() {
    return this.state.theme;
  }

  constructor() {
    makeAutoObservable(this);
    makePersistable(this.state, {
      name: 'ThemeDataStore',
      properties: ['theme'],
      storage: window.localStorage,
    });
  }

  setTheme(value: ThemeValue) {
    this.state.theme = value;
  }

  toggle() {
    this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  dispose() {
    stopPersisting(this.state);
  }
}

type ThemeValue = 'dark' | 'light';

interface State {
  theme: ThemeValue;
}
