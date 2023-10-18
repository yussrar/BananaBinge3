import React, { useEffect, useState } from 'react';
import './Cards.css';
import axios from 'axios';
import { useUser} from './UserProvider';
import { useNavigate } from 'react-router-dom';

function Cards() {
  const navigate = useNavigate();
  const { user } = useUser(); 


  const [tvShows, setTvShows] = useState([]);
  const [userWishList, setUserWishList] = useState([]); 
  const [addToWishlistMessage, setAddToWishlistMessage] = useState(''); // State to hold the response message


  useEffect(() => {
    async function fetchUserWishList() {
      try {
        const response = await axios.get(`https://banana-binge2.vercel.app/api/wishlist?userId=${user._id}`);
        const data = response.data;
        setUserWishList(data);
      } catch (error) {
        console.error('Error fetching wish list data:', error);
      }
    }

    fetchUserWishList();

    async function fetchTrendingTVShows() {
      try {
        const response = await axios.get('https://banana-binge2.vercel.app/api/trendingTVShows');
        const data = response.data;
        setTvShows(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchTrendingTVShows();
  }, [user]);

  const isAlreadyAdded = (tvShowId) => {
    return userWishList.some((item) => item.tvShowId === tvShowId);
  };





  const handleDetail = async (tvShowId, tvShowName) => {
    try {

      // Create a data object to send in the request body
      const data = {
        tvShowId: tvShowId,
        tvShowName: tvShowName,
      };

      console.log(data);

      const response = await axios.post('https://banana-binge2.vercel.app/api/showDetails', data);
      const responseData = response.data;

      // Access the data from The Movie DB API
      const movieDBData = responseData.movieDB;

      console.log("here");
      // Access the data from the YouTube API
      const youtubeData = responseData.youtube;
console.log(movieDBData);
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
        return; }
      // Create a data object to send in the request body
      const data = {
        tvShowId: tvShowId,
        UserId : UserId,
      };

      console.log(data);

      const response = await axios.post('https://banana-binge2.vercel.app/api/addToWishlist', data);
      const responseData = response.data;
      setUserWishList([...userWishList, { tvShowId }]);

      setAddToWishlistMessage(responseData.message);

      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  

  useEffect(() => {
    async function fetchTrendingTVShows() {
      try {
        const response = await axios.get('https://banana-binge2.vercel.app/api/trendingTVShows');
        const data = response.data;
        setTvShows(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchTrendingTVShows();
  }, []);

  return (
    <div className='main1'>
      <h1 className='list-heading'>Popular Today</h1>
      <div className="movie-cards">
        {tvShows.map((tvShow) => (
          <div className="div2" key={tvShow.id}>
            <img src={`http://image.tmdb.org/t/p/w500${tvShow.poster_path}`} alt={tvShow.title} />
            <p className='showname'>{tvShow.name}</p>
            <p className="showDeets">{tvShow.overview}</p>
            <p className="showRating">Rating: {tvShow.vote_average}</p>
            <p>Release Year: {tvShow.first_air_date.split('-')[0]}</p>
            <button className="det-button"
              onClick={() => handleDetail(tvShow.id, tvShow.name)}>
              View Details</button>
              <button
                className="det-button"
                onClick={() => handleAddToWishlist(tvShow.id, user ? user._id : null)}
              >
                {isAlreadyAdded(tvShow.id) ? 'Added to Your WatchList' : 'Add to WatchList'}
              </button>
          </div> 
        ))}
      </div>
    </div>
  );
}

export default Cards;
