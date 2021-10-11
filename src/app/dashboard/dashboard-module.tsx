import { provider } from 'react-ioc';
import { DashboardPage } from './_components/dashboard-page/dashboard-page';
import { observer } from 'mobx-react-lite';

const DashboardModule = provider()(
  //
  // Services available only within DashboardModule should be provided here
  //
  observer(() => {
    // Dashboard routes should be provided here
    return <DashboardPage />;
  }),
);
export default DashboardModule;
