import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Details.css';
import axios from 'axios'; // Import Axios for making API requests
import { useUser } from './UserProvider';
import { useNavigate } from 'react-router-dom';

function Details() {
  const location = useLocation();
  const showDetails = location.state.showDetails;


  const navigate = useNavigate();
  const { user } = useUser();

  const [userWishList, setUserWishList] = useState([]);

  const isAlreadyAdded = (tvShowId) => {
    return userWishList.some((item) => item.tvShowId === tvShowId);
  };

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
  }, [user]);

  const handleAddToWishlist = async () => {
    try {
      if (!user) {
        // No user is logged in, navigate to the login page
        navigate('/Login'); // Adjust the login route as needed
        return;
      }

      if (isAlreadyAdded(showDetails.movieDB.id)) {

        return;
      }

      // Create a data object to send in the request body
      const data = {
        tvShowId: showDetails.movieDB.id,
        UserId: user._id,
      };

      const response = await axios.post('https://banana-binge2.vercel.app/api/addToWishlist', data);
      const responseData = response.data;
      setUserWishList([...userWishList, { tvShowId: showDetails.movieDB.id }]);
      console.log(responseData.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="main">
        <div>
          {/* image and details */}
          <div className="detailsbox">
            <h1>{showDetails.movieDB.name}</h1>
            <p>{showDetails.movieDB.tagline}</p>

            <button
              className="det-button"
              onClick={handleAddToWishlist}
            >
              {isAlreadyAdded(showDetails.movieDB.id) ? 'Added to Your WatchList' : 'Add to WishList'}
            </button>


            <div className='imagesection'>
              <img
                src={`http://image.tmdb.org/t/p/w500${showDetails.movieDB.backdrop_path}`}
                alt={showDetails.movieDB.name}
              />
              <div>
                <p>{showDetails.movieDB.overview}</p>

                <p>Network: {showDetails.movieDB.networks[0].name}</p>
                <p>Rating: {showDetails.movieDB.vote_average}</p>
                <p> <a href={showDetails.movieDB.homepage} rel="noopener noreferrer">
                  {showDetails.movieDB.homepage}
                </a></p>
              </div>
            </div>
          </div>

          <div className='infoDivs'>
            <div className="info">
              {/* Div for genre */}

              <div className="genres threeDivs">
                <h2>Genres</h2>
                <ul>
                  {showDetails.movieDB.genres.map((genre, index) => (
                    <li key={index}>{genre.name}</li>
                  ))}
                </ul>
              </div>
              {/* Div for Air details */}
              <div className="deets threeDivs">
                <h2> Air Details</h2>
                <p>Last Episode Air Date: {showDetails.movieDB.last_episode_to_air.air_date}</p>
                <p>Number of Episodes: {showDetails.movieDB.number_of_episodes}</p>
                <p>Number of Seasons: {showDetails.movieDB.number_of_seasons}</p>
                <p>First Air Date: {showDetails.movieDB.first_air_date}</p>
                <p>Last Air Date: {showDetails.movieDB.last_air_date}</p>

                <p>Status: {showDetails.movieDB.status}</p>


              </div>

              {/* Div for Rating and watch provider */}

            </div>

          </div>


          <div className="seasons-container">
            <h2 className="seasons-heading">Seasons</h2>
            <ul className="seasons-list">
              {showDetails.movieDB.seasons.map((season, index) => (
                <li className="season-card" key={index}>
                  <h3 className="season-title">{season.name}</h3>
                  <img
                    src={`http://image.tmdb.org/t/p/w500${season.poster_path}`}
                    alt={showDetails.movieDB.name}
                    className="season-poster"
                  />
                  <p className="season-overview"> {season.overview}</p>
                  <p className="season-air-date">Air Date: {season.air_date}</p>
                  <p className="season-episode-count">Number of Episodes: {season.episode_count}</p>
                  <p className="season-vote-average">Vote Average: {season.vote_average}</p>

                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="video-container">
          <h2>Trailers</h2>
          {showDetails.youtube && showDetails.youtube.items && showDetails.youtube.items.length > 0 ? (
            showDetails.youtube.items.map((video, index) => (
              <iframe
                key={index}
                className="frame"
                title={`Video ${index + 1}`}
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            ))
          ) : (
            <p>No trailers available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Details;
