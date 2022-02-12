import { useInstance } from 'react-ioc';
import { observer } from 'mobx-react-lite';
import { Alert, Snackbar } from '@mui/material';
import { AppToastViewStore } from '@/app/_common/stores/app-toast.view-store';

export const AppToast = observer(() => {
  const store = useInstance(AppToastViewStore);

  return (
    <Snackbar open={store.opened} autoHideDuration={6000} onClose={store.close}>
      <Alert
        onClose={store.close}
        severity={store.severity}
        sx={{ width: '100%' }}
      >
        {store.message}
      </Alert>
    </Snackbar>
  );
});
