'use client';

import { useState } from 'react';
import { useAuth } from '@/app/utils/AuthContext';
import { Button, Divider } from '@mui/material';
import CreateUser from '../components/CreateUser';
import UsersTable from '../components/UsersTable';

export default function GrantAccessPage() {
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState<boolean>(false);

  if (!isAdmin) return <p>Access denied. Admins only.</p>;

  return (
    <div>
      <div className="flex justify-between p-1">
        <h3>Users</h3>
        {isAdmin && (
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add User
          </Button>
        )}
      </div>
      <Divider />
      <UsersTable />
      <CreateUser open={open} setOpen={setOpen} />
    </div>
  );
}
