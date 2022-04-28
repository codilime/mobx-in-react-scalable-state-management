import { useCallback } from 'react';
import { useInstance } from 'react-ioc';
import { Controller, useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import TextField from '@material-ui/core/TextField';
import { Modal } from '@/app/_common/components/modal/modal';
import {
  UserFormData,
  UserFormModalViewStore,
} from '@/app/users/_components/user-form-modal/user-form-modal.view-store';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

export const UserFormModal = observer(() => {
  const { modalState } = useInstance(UserFormModalViewStore);
  return <Modal state={modalState}>{modalState.opened && <UserForm />}</Modal>;
});

const UserForm = observer(() => {
  const store = useInstance(UserFormModalViewStore);

  const { control, handleSubmit, reset } = useForm<UserFormData>({
    defaultValues: store.defaultValues,
  });

  const onSubmit = useCallback(
    async (data) => {
      await store.submit(data);
    },
    [store],
  );

  return (
    <>
      <DialogTitle>{store.title}</DialogTitle>
      <DialogContent
        style={{
          gap: 20,
          display: 'flex',
          flexDirection: 'column',
          width: 500,
        }}
      >
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
