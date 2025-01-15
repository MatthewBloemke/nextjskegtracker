'use client';
import React, { useState, useEffect } from 'react';
import CreateDistributor from '../components/CreateModal';
import { Button, Divider } from '@mui/material';
import { useSnackbar } from '../utils/SnackbarContext';
import { useLoading } from '../utils/LoadingContext';
import { getAuth } from 'firebase/auth';
import { useAuth } from '../utils/AuthContext';
import { db } from '@/firebase/client';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import DistributorsAccordion from './DistributorsAccordion';

interface Distributor {
  id: string;
  name: string;
}

const DistributorsPage = () => {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { setLoading } = useLoading();
  const auth = getAuth();
  const { isAdmin } = useAuth();
  const user = auth.currentUser;

  // Fetch distributors on component mount
  useEffect(() => {
    const fetchDistributors = async () => {
      setLoading(true);
      try {
        const distributorsRef = collection(db, 'distributors');
        const querySnapshot = await getDocs(distributorsRef);
        const fetchedDistributors: Distributor[] = querySnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            name: doc.data().name,
          })
        );
        setDistributors(fetchedDistributors);
      } catch (error) {
        showSnackbar(`Error fetching distributors: ${error}`, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDistributors();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await user?.getIdToken();
      const tokenResult = await user?.getIdTokenResult();
      if (!tokenResult?.claims.admin || !token) {
        showSnackbar('Error: Unauthorized', 'error');
        return;
      }

      const distributorsRef = collection(db, 'distributors');
      const docRef = await addDoc(distributorsRef, {
        name,
        averageDaysOut: 0,
      });

      // Add the new distributor to the list
      setDistributors((prev) => [...prev, { id: docRef.id, name }]);

      showSnackbar('Distributor added successfully!', 'info');
      setName('');
      setOpen(false);
    } catch (error) {
      showSnackbar(`Error adding distributor: ${error}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between p-1">
        <h3>Distributors</h3>
        {isAdmin && (
          <Button onClick={() => setOpen(true)} variant="contained">
            Create distributor
          </Button>
        )}
      </div>
      <Divider />
      <CreateDistributor
        name={name}
        setName={setName}
        open={open}
        setOpen={setOpen}
        handleSubmit={handleSubmit}
      />
      <DistributorsAccordion distributors={distributors} />
    </div>
  );
};

export default DistributorsPage;
