import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {
  Button,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useReducer } from 'react';
import { initialUserState, userReducer } from './userReducer';
import { admin, distributor } from '@/types/interfaces';
import { useSnackbar } from '@/app/utils/SnackbarContext';
import { useLoading } from '@/app/utils/LoadingContext';
import { db } from '@/firebase/client';
import { collection, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export interface EditUserProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedUser: string;
}

export default function EditUser(props: EditUserProps) {
  const { setOpen, open, selectedUser } = props;

  const getInitialUserState = (selectedUser: string) => ({
    ...initialUserState,
    email: selectedUser,
  });

  const [state, dispatch] = useReducer(
    userReducer,
    selectedUser,
    getInitialUserState
  );
  const { showSnackbar } = useSnackbar();
  const { setLoading } = useLoading();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleSelectChange = (event: SelectChangeEvent<string>): void => {
    const { name, value } = event.target;
    console.log(state);
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

      showSnackbar('Employee saved successfully!', 'info');

      setOpen(false);
      dispatch({ type: 'RESET' });
    } catch (error) {
      showSnackbar(`Error adding employee: ${error}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth={true} maxWidth="xs">
      <DialogTitle>Edit User</DialogTitle>
      <Divider />
      <DialogContent>
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
          <div>
            <Button
              color="error"
              variant="outlined"
              sx={{ marginRight: '5px' }}
            >
              Disable
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              Save
            </Button>
          </div>
        </div>
      </DialogActions>
    </Dialog>
  );
}
