import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, TextField } from '@mui/material';

export interface CreateDistributorProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleSubmit: () => void;
  name: string;
  setName: (name: string) => void;
}

export default function CreateDistributor(props: CreateDistributorProps) {
  const { setOpen, open, handleSubmit, name, setName } = props;
  const [disabled, setDisabled] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setName(value);
    if (value.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Create Distributor</DialogTitle>
      <DialogContent>
        <TextField
          value={name}
          onChange={handleChange}
          variant="filled"
          label="Name"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={disabled}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
