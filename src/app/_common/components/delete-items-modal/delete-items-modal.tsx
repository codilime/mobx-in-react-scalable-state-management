import { FC, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Modal } from '../modal/modal';
import { ModalState } from '@/app/_common/components/modal/modal.state';
import { size } from 'lodash';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

interface DeleteItem {
  id: string;
  label: string;
}

export interface DeleteItemsModalData {
  items: Array<DeleteItem>;
}

interface DeleteItemsModalProps {
  state: ModalState<DeleteItemsModalData>;
  pending?: boolean;
  onAccept: (items: Array<DeleteItem['id']>) => void;
  onCancel?: () => void;
}

export const DeleteItemsModal: FC<DeleteItemsModalProps> = observer(
  ({ state, onAccept, onCancel, pending }) => {
    const [unchecked, setUnchecked] = useState<Record<string, true>>({});

    useEffect(() => {
      if (!state.opened) {
        setUnchecked({});
      }
    }, [state.opened]);

    const handleCancel = useCallback(() => state.close(), [state]);

    const handleAccept = useCallback(() => {
      const allIds = state.data?.items.map((item) => item.id) || [];
      const acceptedIds = allIds.filter((id) => !unchecked[id]);
      onAccept(acceptedIds);
    }, [onAccept, state, unchecked]);

    const handleChange = useCallback((event) => {
      setUnchecked((oldState) => {
        const unchecked = { ...oldState };
        delete unchecked[event.target.name];
        if (!event.target.checked) {
          unchecked[event.target.name] = true;
        }
        return unchecked;
      });
    }, []);

    const areAllUnchecked = size(unchecked) === size(state.data?.items);

    return (
      <Modal state={state} onClose={handleCancel}>
        <DialogTitle>Confirmation</DialogTitle>

        <DialogContent style={{ width: 500 }}>
          <DialogContentText>Are you sure to delete:</DialogContentText>

          <FormGroup>
            {state.data?.items.map((item) => (
              <FormControlLabel
                key={item.id}
                label={item.label}
                control={
                  <Checkbox
                    color="primary"
                    name={item.id}
                    checked={!unchecked[item.id]}
                    onChange={handleChange}
                  />
                }
              />
            ))}
          </FormGroup>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          {pending ? (
            <CircularProgress size={24} />
          ) : (
            <Button onClick={handleAccept} disabled={areAllUnchecked}>
              OK
            </Button>
          )}
        </DialogActions>
      </Modal>
    );
  },
);
