'use client';
import React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IoSpeedometerOutline, IoWine } from 'react-icons/io5';
import { GiBarrel, GiCellarBarrels } from 'react-icons/gi';
import { BiSolidReceipt } from 'react-icons/bi';
import { MdLocalShipping } from 'react-icons/md';
import Image from 'next/image';
import Icon from '@/../public/favicon.png';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import { FaUserShield } from 'react-icons/fa';
import Link from 'next/link';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,

  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 0),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      },
    },
  ],
}));

const Navbar = () => {
  const { isAdmin } = useAuth();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const showNavbar = pathname !== '/signin';

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  if (!showNavbar) return null;

  return (
    <Drawer
      variant="permanent"
      open={open}
      color="primary"
      sx={{ boxShadow: 3 }}
    >
      <DrawerHeader sx={{ justifyContent: open ? 'flex-end' : 'center' }}>
        {open ? (
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon className="text-3xl text-white" />
            ) : (
              <ChevronLeftIcon className="text-3xl text-white" />
            )}
          </IconButton>
        ) : (
          <IconButton
            color="default"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            sx={{
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
          >
            <Image src={Icon} alt="keg tracker icon" width={32} height={32} />
          </IconButton>
        )}
      </DrawerHeader>
      <Divider sx={{ bgcolor: 'white' }} />
      <List>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              justifyContent: 'flex-start',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '5px',
              paddingRight: 0,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: '48px',
                justifyContent: 'center',
                display: 'flex',
                padding: '8px',
              }}
            >
              <IoSpeedometerOutline className="text-3xl text-white" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              justifyContent: 'flex-start',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '5px',
              paddingRight: 0,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: '48px',
                justifyContent: 'center',
                display: 'flex',
                padding: '8px',
              }}
            >
              <GiBarrel className="text-3xl text-white" />
            </ListItemIcon>
            <ListItemText primary="Kegs" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              justifyContent: 'flex-start',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '5px',
              paddingRight: 0,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: '48px',
                justifyContent: 'center',
                display: 'flex',
                padding: '8px',
              }}
            >
              <BiSolidReceipt className="text-3xl text-white" />
            </ListItemIcon>
            <ListItemText primary="Orders" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              justifyContent: 'flex-start',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '5px',
              paddingRight: 0,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: '48px',
                justifyContent: 'center',
                display: 'flex',
                padding: '8px',
              }}
            >
              <GiCellarBarrels className="text-3xl text-white" />
            </ListItemIcon>
            <ListItemText primary="Batches" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <Link href="/distributors">
            <ListItemButton
              sx={{
                justifyContent: 'flex-start',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '5px',
                paddingRight: 0,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: '48px',
                  justifyContent: 'center',
                  display: 'flex',
                  padding: '8px',
                }}
              >
                <MdLocalShipping className="text-3xl text-white" />
              </ListItemIcon>
              <ListItemText
                primary="Distributors"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              justifyContent: 'flex-start',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '5px',
              paddingRight: 0,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: '48px',
                justifyContent: 'center',
                display: 'flex',
                padding: '8px',
              }}
            >
              <IoWine className="text-3xl text-white" />
            </ListItemIcon>
            <ListItemText primary="Flavors" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
        {isAdmin && (
          <ListItem disablePadding sx={{ display: 'block' }}>
            <Link href="/admin/grant-access">
              <ListItemButton
                sx={{
                  justifyContent: 'flex-start',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '5px',
                  paddingRight: 0,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: '48px',
                    justifyContent: 'center',
                    display: 'flex',
                    padding: '8px',
                  }}
                >
                  <FaUserShield className="text-3xl text-white" />
                </ListItemIcon>
                <ListItemText primary="Admin" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </Link>
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default Navbar;
