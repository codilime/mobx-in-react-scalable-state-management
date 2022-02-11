import { useCallback } from 'react';
import { useInstance } from 'react-ioc';
import { Controller, useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { Dialog } from '@mui/material';
import TextField from '@material-ui/core/TextField';
import { UserFormData, UserModalViewStore } from '@/app/users/_components/user-modal/user-modal.view-store';
import { Button, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

export const UserModal = observer(() => {
  const store = useInstance(UserModalViewStore);
  return (
    <Dialog open={store.opened} onClose={store.close}>
      {store.opened && <UserForm />}
    </Dialog>
  );
});

const UserForm = observer(() => {
  const store = useInstance(UserModalViewStore);

  const { control, handleSubmit, reset } = useForm<UserFormData>({ defaultValues: store.defaultValues });

  const onSubmit = useCallback(
    async (data) => {
      await store.submit(data);
    },
    [store],
  );

  const title = store.mode === 'create' ? 'Add new user' : 'Edit ' + store.user?.email;
  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent style={{ gap: 20, display: 'flex', flexDirection: 'column', width: 500 }}>
        <Controller
          control={control}
          name={'firstName'}
          rules={{ required: 'First name is required' }}
          render={({ field: { onChange, value }, fieldState }) => (
            <TextField
              onChange={onChange}
              value={value}
              label="First Name"
              fullWidth
              variant="standard"
              required
              autoFocus
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name={'lastName'}
          rules={{ required: 'Last name is required' }}
          render={({ field: { onChange, value }, fieldState }) => (
            <TextField
              onChange={onChange}
              value={value}
              label="Last Name"
              fullWidth
              variant="standard"
              required
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name={'email'}
          rules={{ required: 'Email is required' }}
          render={({ field: { onChange, value }, fieldState }) => (
            <TextField
              onChange={onChange}
              value={value}
              label="Email"
              fullWidth
              variant="standard"
              required
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => reset()}>Reset</Button>
        <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
      </DialogActions>
    </>
  );
});
