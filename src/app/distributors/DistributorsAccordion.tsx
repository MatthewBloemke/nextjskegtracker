import React, { useState, Suspense } from 'react';
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Typography, Skeleton, styled } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';
import DistributorDetailsComponent from './DistributorDetails';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: 'rotate(90deg)',
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles('light', {
    backgroundColor: 'rgba(255, 255, 255, .05)',
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

interface Distributor {
  id: string;
  name: string;
}

interface DistributorDetails {
  id: string;
  name: string;
}

interface Props {
  distributors: Distributor[];
}

const DistributorsAccordion: React.FC<Props> = ({ distributors }) => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [details, setDetails] = useState<Record<string, DistributorDetails>>(
    {}
  );
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleAccordionChange = (distributorId: string) => async () => {
    const isExpanding = expanded !== distributorId;
    setExpanded(isExpanding ? distributorId : false);

    if (isExpanding && !details[distributorId]) {
      setLoading((prev) => ({ ...prev, [distributorId]: true }));

      try {
        const docRef = doc(db, 'distributors', distributorId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetchedDetails: DistributorDetails = {
            id: distributorId,
            ...docSnap.data(),
          } as DistributorDetails;

          setDetails((prev) => ({
            ...prev,
            [distributorId]: fetchedDetails,
          }));
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching distributor details:', error);
      } finally {
        setLoading((prev) => ({ ...prev, [distributorId]: false }));
      }
    }
  };

  return (
    <div>
      {distributors.map((distributor) => (
        <Accordion
          sx={{ boxShadow: 'none' }}
          key={distributor.id}
          expanded={expanded === distributor.id}
          onChange={handleAccordionChange(distributor.id)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${distributor.id}-content`}
            id={`${distributor.id}-header`}
          >
            <Typography component="span">{distributor.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {loading[distributor.id] ? (
              <Skeleton variant="rounded" />
            ) : details[distributor.id] ? (
              <Suspense fallback={<Skeleton variant="rounded" />}>
                <DistributorDetailsComponent
                  details={details[distributor.id]}
                />
              </Suspense>
            ) : (
              <Typography>No details available.</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default DistributorsAccordion;
