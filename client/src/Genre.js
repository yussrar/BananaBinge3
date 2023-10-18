import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Genre() {
  const [parts, setGenres] = useState();
  const navigate = useNavigate();

  const handleGenreClick = async (genreId, genreName) => {
    try {
      const response = await axios.post(`https://banana-binge2.vercel.app/api/selectedGenre/${genreId}`);
      const responseData = response.data;

      navigate('/Lists', {
        state: {
          searchResults: responseData,
          query: genreName,
        },
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await axios.get('https://banana-binge2.vercel.app/api/genres');
        const data = response.data;
        setGenres(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchGenres();
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding="20px"
      borderRadius="10px"
      maxWidth="80%"
      margin="0 auto"
      marginBottom="4em"
    >
      <div className="genre-buttons">
        {parts && parts.genres ? (
          parts.genres.map((genre) => (
            <Button
              className='genre-button'
              key={genre.id}
              onClick={() => handleGenreClick(genre.id, genre.name)}
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: 'Open Sans, sans-serif',
                color: 'black',
                padding: '8px 16px',
                backgroundColor: '#f5f5f5',
                margin: '10px',
                borderRadius: '5px',
                transition: 'background-color 0.3s',
                '&:hover': { // Apply hover effect
                  backgroundColor: 'black',
                  color: 'white',
                },
              }}
            >
              {genre.name}
            </Button>
          ))
        ) : (
          <p>Loading genres...</p>
        )}
      </div>
    </Box>
  );
}

export default Genre;
