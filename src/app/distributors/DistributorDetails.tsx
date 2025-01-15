import React from 'react';
import { Typography } from '@mui/material';

interface DistributorDetails {
  id: string;
  name: string;
}

interface DistributorDetailsProps {
  details: DistributorDetails;
}

const DistributorDetails: React.FC<DistributorDetailsProps> = ({ details }) => {
  return (
    <div>
      <Typography variant="body1">Name: {details.name}</Typography>
      <h4>Here are the distributor details</h4>
    </div>
  );
};

export default DistributorDetails;
