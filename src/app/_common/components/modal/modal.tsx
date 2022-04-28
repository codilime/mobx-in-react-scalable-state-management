import { FC, useCallback } from 'react';
import { Dialog } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { ModalState } from '@/app/_common/components/modal/modal.state';

interface ModalProps {
  state: ModalState<unknown>;
  onClose?: () => void;
}

export const Modal: FC<ModalProps> = observer(
  ({ state, onClose, children }) => {
    const handleOnClose = useCallback(() => {
      state.close();
      onClose?.();
    }, [onClose, state]);

    return (
      <Dialog open={state.opened} onClose={handleOnClose}>
        {children}
      </Dialog>
    );
  },
);
