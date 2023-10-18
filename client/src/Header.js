import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserProvider';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useUser();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'black' }}>
      <Toolbar>
        <Typography variant="h5" component={Link} to="/"
          sx={{
            marginTop: '1em',// Replace 'your_desired_color' with the color you want
            fontFamily:  "'Borel', cursive;" // Replace 'your_desired_font_family' with the font family you want
          }}
          style={{ textDecoration: 'none', color: '#E6AF2E' }}>
          BananaBinge
        </Typography>
        <div style={{ flex: 1 }}></div>
        <Button component={Link} to="/" style={{ color: 'white' }}>
          Home
        </Button>
        <Button component={Link} to="/About" style={{ color: 'white' }}>
          About
        </Button>
        {user ? (
          <div>
            <Button
              startIcon={<AccountCircleIcon />}
              aria-controls="user-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
              style={{ color: 'white' }}
            >
              Hello, {user.name}
            </Button>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/Profile" onClick={handleMenuClose}>
                My Profile
              </MenuItem>
              <MenuItem component={Link} to="/WishList" onClick={handleMenuClose}>
                Wish List
              </MenuItem>
              <MenuItem component={Link} to="/Logout" onClick={handleMenuClose}>
                Logout
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <Button component={Link} to="/login" style={{ color: 'white' }}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
