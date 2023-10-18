import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from './UserProvider';
import './WishList.css'

function Wishlist() {
  const { user } = useUser();

  if (user) {
    return <UserWishList />
  }

  else {
    return <p>Please login</p>
  }

}

function UserWishList() {
  const { user } = useUser();
  const [wishlistData, setWishlistData] = useState([]);
  const [detailedWishlist, setDetailedWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the wish list data
  useEffect(() => {
    async function fetchWishlist() {
      try {
        const response = await axios.get(`https://banana-binge2.vercel.app/api/wishlist?userId=${user._id}`);
        const data = response.data;
        setWishlistData(data);
        console.log("Feticking wish list working");
        console.log("data in watchlist js");
        console.log(data);
      } catch (error) {
        console.error('Error fetching wish list data:', error);
      }
    }

    fetchWishlist();
  }, [user]);

  // Fetch details for each TV show in the wish list
  useEffect(() => {
    async function fetchWishlistDetails() {
      try {
        const detailPromises = wishlistData.map(async (item) => {
          const data = {
            tvShowId: item.tvShowId,
            tvShowName: item.tvShowName,
          };
          const response = await axios.post(`https://banana-binge2.vercel.app/api/showDetails`, data);
          console.log(response.data.movieDB.name);
          return response.data;

        });

        const detailedData = await Promise.all(detailPromises);
        setDetailedWishlist(detailedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wish list details:', error);
        setLoading(false);
      }
    }

    if (wishlistData.length > 0) {
      fetchWishlistDetails(); // Fetch details only if there are items in the wish list
    }
  }, [wishlistData]);


  // Function to handle removal of a TV show from the wish list
  const handleRemoveFromWishlist = async (tvShowId) => {


    try {
      console.log(user._id);
      console.log(tvShowId)
      // Send a request to the server to remove the TV show from the wish list
      const response = await axios.post('https://banana-binge2.vercel.app/api/removeFromWishlist', {
        userId: user._id,
        tvShowId: tvShowId,
      });

      if (response.status === 200) {
        // TV show removed successfully, update the wish list
        setWishlistData(wishlistData.filter((item) => item.tvShowId !== tvShowId));
      }
    } catch (error) {
      console.error('Error removing TV show from wish list:', error);
    }
  };

  return (
    <div className="wishlist-container">
      <h1>My Wish List</h1>
      {loading ? (
        <p>Loading wish list data...</p>
      ) : (
        <div className="WishlistMain">
          {detailedWishlist.map((item) => (
            <div className="wishlist-card" key={item.movieDB.id}>
              <div className="wishimg">
                <img
                  src={`http://image.tmdb.org/t/p/w500${item.movieDB.backdrop_path}`}
                  alt={item.movieDB.name}
                />
              </div>
              <div className="wishdetail">
                <div className="name-overview">
                  <p className="wishname">{item.movieDB.name}</p>
                  <p className="wishoverview">{item.movieDB.overview}</p>
                </div>
                <div className="genre-rating-network-link">
                  
                  
                    <p><strong>Rating:</strong> {item.movieDB.vote_average}</p>
                    <p><bold>Network:</bold> {item.movieDB.networks[0].name}</p>
                    <p>
                      Watch Here:
                      <a href={item.movieDB.homepage} rel="noopener noreferrer">
                        {item.movieDB.homepage}
                      </a>
                    </p>

                  <div className="genrediv">
                    <p>Genres</p>
                    <ul className="genrelist">
                      {item.movieDB.genres.map((genre, index) => (
                        <li key={index}>|{genre.name}|</li>
                
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                <button onClick={() => handleRemoveFromWishlist(item.movieDB.id)}>
                  Remove
                </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
}

export default Wishlist;
