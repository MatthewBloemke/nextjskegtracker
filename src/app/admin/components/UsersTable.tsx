import React, { useEffect, useState } from 'react';
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/firebase/client';
import EditUser from './EditUser';

const UsersTable = () => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<string>('');

  const handleRowClick = (params: GridRowParams) => {
    setSelectedUser(params.row.Email);
    setOpen(true);
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'employees'));
        const userData = querySnapshot.docs.map((doc, index) => ({
          id: index,
          Email: doc.data().email,
          Admin: doc.data().admin,
          Distributor: doc.data().distributor,
        }));
        setRows(userData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);
  const columns: GridColDef[] = [
    { field: 'Email', headerName: 'Email', width: 300, flex: 2 },
    { field: 'Admin', headerName: 'Admin', width: 150, flex: 1 },
    { field: 'Distributor', headerName: 'Distributor', width: 150, flex: 1 },
  ];

  return (
    <div className="m-3">
      <DataGrid rows={rows} columns={columns} onRowClick={handleRowClick} />
      <EditUser open={open} setOpen={setOpen} selectedUser={selectedUser} />
    </div>
  );
};

export default UsersTable;
