import { inject } from 'react-ioc';
import { makeAutoObservable } from 'mobx';
import { ThemeDataStore } from '../../stores/theme.data-store';

export class PageLayoutViewStore {
  private themeDataStore = inject<ThemeDataStore>(this, ThemeDataStore);

  private state: State = {
    drawerOpened: false,
  };

  get drawerOpened() {
    return this.state.drawerOpened;
  }

  get theme() {
    return this.themeDataStore.theme;
  }

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  openDrawer() {
    this.state.drawerOpened = true;
  }

  closeDrawer() {
    this.state.drawerOpened = false;
  }

  toggleTheme() {
    this.themeDataStore.toggle();
  }
}

interface State {
  drawerOpened: boolean;
}
