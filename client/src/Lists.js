
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserProvider';
import './Cards.css';

function Lists() {


  const navigate = useNavigate();
  const [addToWishlistMessage, setAddToWishlistMessage] = useState(''); // State to hold the response message
  const { user } = useUser();
  const [userWishList, setUserWishList] = useState([]); // Define userWishList as a state variable



  const isAlreadyAdded = (tvShowId) => {
    return userWishList.some((item) => item.tvShowId === tvShowId);
  };


  //handle click 

  const handleDetail = async (tvShowId, tvShowName) => {
    try {

      // Create a data object to send in the request body
      const data = {
        tvShowId: tvShowId,
        tvShowName: tvShowName,
      };

      const response = await axios.post('https://banana-binge2.vercel.app/api/showDetails', data);
      const responseData = response.data;



      // Access the data from The Movie DB API
      const movieDBData = responseData.movieDB;

      // Access the data from the YouTube API
      const youtubeData = responseData.youtube;

      // Now you have both sets of data and can navigate to the Details page with all the information.
      navigate('/Details', {
        state: {
          showDetails: {
            movieDB: movieDBData,
            youtube: youtubeData,
          },
        },
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddToWishlist = async (tvShowId, UserId) => {
    try {
      if (!UserId) {
        // No user is logged in, navigate to the login page
        navigate('/Login'); // Adjust the login route as needed
        return;
      }


      if (isAlreadyAdded(tvShowId)) {
        setAddToWishlistMessage('Already Added');
        return;
      }

      // Create a data object to send in the request body
      const data = {
        tvShowId: tvShowId,
        UserId: UserId,
      };

      const response = await axios.post('https://banana-binge2.vercel.app/api/addToWishlist', data);
      const responseData = response.data;
      setAddToWishlistMessage(responseData.message);
      setUserWishList([...userWishList, { tvShowId }]);

    } catch (error) {
      console.error('Error:', error);
    }
  };



  // Use the useLocation hook to access the location state
  const location = useLocation();
  const searchResults = location.state.searchResults;
  const searchQuery = location.state.query;

  useEffect(() => {
    async function fetchUserWishList() {
      try {
        const response = await axios.get(`https://banana-binge2.vercel.app/api/wishlist?userId=${user._id}`);
        const data = response.data;
        setUserWishList(data); // Set userWishList with the fetched data
      } catch (error) {
        console.error('Error fetching wish list data:', error);
      }
    }

    fetchUserWishList();

    // ...
  }, [user]);

  return (
    <div className='main1'>
      <div>
        <p className='list-heading'>Search Results for : {searchQuery}</p>
        <div className="movie-cards">
          {searchResults.map((tvShow) => (
            <div className="div2" key={tvShow.id}>
              <img src={`http://image.tmdb.org/t/p/w500${tvShow.poster_path}`} alt={tvShow.title} />
              <p>{tvShow.name}</p>
              <p>{tvShow.overview}</p>
              <p>Rating: {tvShow.vote_average}</p>
              <p>Release Year: {tvShow.first_air_date.split('-')[0]}</p>
              <div className='buttons'>
                <button className="det-button"
                  onClick={() => handleDetail(tvShow.id, tvShow.name)}>
                  View Details</button>
                <button
                  className="det-button"
                  onClick={() => handleAddToWishlist(tvShow.id, user ? user._id : null)}
                >
                  {isAlreadyAdded(tvShow.id) ? 'Added to Your WatchList' : 'Add to WishList'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Lists;

