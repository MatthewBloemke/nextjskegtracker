import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { ChangeEvent, useReducer, useState } from 'react';
import { initialUserState, userReducer } from './userReducer';
import { admin, distributor, email } from '@/types/interfaces';
import { useSnackbar } from '@/app/utils/SnackbarContext';
import { useLoading } from '@/app/utils/LoadingContext';
import { db } from '@/firebase/client';
import { collection, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export interface CreateUserProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CreateUser(props: CreateUserProps) {
  const { setOpen, open } = props;
  const [state, dispatch] = useReducer(userReducer, initialUserState);
  const [disabled, setDisabled] = useState(true);
  const { showSnackbar } = useSnackbar();
  const { setLoading } = useLoading();
  const auth = getAuth();
  const user = auth.currentUser;
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;
    if (value.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
    dispatch({ type: name as 'email', value });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>): void => {
    const { name, value } = event.target;
    dispatch({
      type: name as 'admin' | 'distributor',
      value: value === 'true',
    });
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!user) return;

      const token = await user?.getIdToken();
      const tokenResult = await user?.getIdTokenResult();
      if (!tokenResult?.claims.admin || !token) {
        showSnackbar('Error: Unauthorized', 'error');
        return;
      }

      const employeesRef = collection(db, 'employees');

      const sanitizedEmail = state.email.replace(/[@.]/g, '_');
      const docRef = doc(employeesRef, sanitizedEmail);
      await setDoc(docRef, state);

      showSnackbar('Employee added successfully!', 'info');

      setOpen(false);
      dispatch({ type: 'RESET' });
    } catch (error) {
      showSnackbar(`Error adding employee: ${error}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Create User</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <TextField
            name={email}
            value={state.email}
            onChange={handleChange}
            variant="filled"
            label="Email"
          />
          <br className="h-1" />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="user-distributor-label">Distributor</InputLabel>
          <Select
            variant="filled"
            labelId="user-distributor-label"
            id="user-distributor"
            value={String(state.distributor)}
            label="Distributor"
            name={distributor}
            onChange={handleSelectChange}
            disabled={state.admin}
          >
            <MenuItem value={'true'}>True</MenuItem>
            <MenuItem value={'false'}>False</MenuItem>
          </Select>
          <br />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="user-admin-label">Admin</InputLabel>
          <Select
            name={admin}
            variant="filled"
            labelId="user-admin-label"
            id="user-admin"
            value={String(state.admin)}
            label="Admin"
            onChange={handleSelectChange}
            disabled={state.distributor}
          >
            <MenuItem value={'true'}>True</MenuItem>
            <MenuItem value={'false'}>False</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <div className="flex justify-between w-full">
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={disabled}
          >
            Create
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
