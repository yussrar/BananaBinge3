import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, InputAdornment, IconButton, Paper, Box, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://banana-binge2.vercel.app/api/searchTVShows?query=${searchQuery}`);
      if (!response.ok) {
        throw Error('Network response was not ok');
      }
      const data = await response.json();

      navigate('/Lists', {
        state: {
          searchResults: data,
          query: searchQuery,
        },
      });
    } catch (error) {
      console.error('Error searching for TV shows:', error);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      //height="40vh" // Adjust the height to control the margin
      marginTop="9em"
      marginBottom="2em"

      
    >
      <Typography variant="h6" style={{ marginBottom: '20px', color: '#333', fontFamily:  "'Open Sans', sans-serif"  }}>
        Explore your next binge-worthy TV show and build your own customized watchlist
      </Typography>
      <Paper
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
          backgroundColor: '#f5f5f5',
          width: '50%', // Adjust the width of the search bar
        }}
      >
        <Input
          placeholder="Search for TV shows"
          disableUnderline
          style={{
            fontSize: '16px',
            
            fontWeight: 'bold',
            color: '#333',
            padding: '6px',
            borderRadius: '5px',
            backgroundColor: 'white',
            width: '100%', // Adjust the width of the input
          }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <IconButton
          onClick={handleSearch}
          color="primary"
          style={{
            backgroundColor: '#E6AF2E',
            color: 'white',
            fontSize: '20px',
            padding: '8px',
            borderRadius: '5px',
          }}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}

export default Search;
