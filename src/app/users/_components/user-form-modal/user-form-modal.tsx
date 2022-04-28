import { useCallback, useEffect, useMemo } from 'react';
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
  const store = useInstance(UserFormModalViewStore);
  const { modalState, defaultValues } = store;

  const { control, handleSubmit, reset } = useForm<UserFormData>({
    defaultValues,
  });

  // reset react-hook-form when defaultValues are changing
  // https://jasonwatmore.com/post/2021/09/23/react-hook-form-reset-form-with-default-values-and-clear-errors
  useEffect(() => reset(defaultValues), [reset, defaultValues]);

  const onReset = useCallback(() => reset(), [reset]);

  const onSubmit = useMemo(
    () => handleSubmit(store.submit),
    [handleSubmit, store],
  );

  return (
    <Modal state={modalState} onClose={onReset}>
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
        <Button onClick={onReset}>Reset</Button>
        <Button onClick={onSubmit}>Submit</Button>
      </DialogActions>
    </Modal>
  );
});
