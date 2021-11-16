import { makeAutoObservable } from 'mobx';
import { ThemeDataStore } from '@/app/_common/stores/theme.data-store';
import { inject } from 'react-ioc';

export class PageLayoutViewStore {
  private themeDataStore = inject(this, ThemeDataStore);

  private state: State = {
    drawerOpened: false,
  };

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  get drawerOpened() {
    return this.state.drawerOpened;
  }

  get theme() {
    return this.themeDataStore.theme;
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
