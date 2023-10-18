import express from "express";
import bodyParser from "body-parser";
import { MongoClient, ServerApiVersion} from "mongodb";
import cors from "cors"
import fetch from "node-fetch";
import bcrypt from "bcryptjs"; 
import session from "express-session";
import { ObjectId } from "mongodb";



const app = express();
const port = process.env.PORT || 3000;
app.use(
  session({
    secret: 'secretkey', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, 
  })
); 
const uri = "mongodb+srv://yusrajamal:yusrajamal@cluster0.stijliu.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(cors());
app.use(bodyParser.json());


//connecting to db trial
async function connectToDatabase() {
  try {
    // Connect to the MongoDB Atlas cluster
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
// Call the connectToDatabase function to establish the connection
connectToDatabase();

//Add a user to mongo db

async function addUser(name, email, password) {
  try {
    await client.connect();
    const db = client.db('BananaBinge');
    const usersCollection = db.collection('users');

    // Create a new user document
    const newUser = {
      name: name,
      email: email,
      password: password, // Ensure to hash the password before inserting
    };

    // Insert the new user document into the 'users' collection
    const result = await usersCollection.insertOne(newUser);

    console.log(`Inserted a new user with the id: ${result.insertedId}`);
  } catch (error) {
    console.error('Error adding a user:', error);
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}

//Registration -for getting user Values
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the user's password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Call your addUser function to add the user to the database
    addUser(name, email, hashedPassword);

    // Send a success response to the client
    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

//getting user by email 
async function getUserByEmail(email) {
  try {
    await client.connect();
    const db = client.db('BananaBinge');
    const usersCollection = db.collection('users');

    // Find the user with the provided email
    const user = await usersCollection.findOne({ email: email });

    return user;
  } catch (error) {
    console.error('Error fetching a user by email:', error);
    return null;
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}


//log in 
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Retrieve the user with the provided email from the database
    const user = await getUserByEmail(email);

    if (!user) {
      res.status(401).json({ message: 'User is not found' });
      return;
    }

    // Verify the provided password against the stored password hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      req.session.user = user;
      console.log('User logged in:', user);
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});


//For getting the data from the movie db api
const url = 'https://api.themoviedb.org/3/trending/tv/day';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NjEwYTIzN2Q4NGYyNWNmYjQ0Zjc5Y2Y5NzJkNWI1MiIsInN1YiI6IjY0YzVlY2IxNjNhNjk1MDBlNmI2ZGU2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GqiMVxRUhX4NqQtmVBJDools-4KTceBJTuWbRBsrWqE'
  }
};

app.get('/', (req, res) => {
  res.send("Server Running");
});

app.get('/api/trendingTVShows', async (req, res) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const trendingTVShows = data.results;
    res.json(trendingTVShows); // Send the data as a JSON response
  } catch (error) {
    console.error('Error fetching trending TV shows:', error);
    res.status(500).json({ error: 'Error fetching trending TV shows' });
  }
});

app.get('/api/searchTVShows', async (req, res) => {
  const { query } = req.query;

  const searchUrl = `https://api.themoviedb.org/3/search/tv?query=${query}`;

  try {
    const response = await fetch(searchUrl, options);
    const data = await response.json();
    const searchResults = data.results;
    res.json(searchResults);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Error fetching search results' });
  }
});

//for genre list
app.get('/api/genres', async (req, res) => {
  const GenreListUrl =  'https://api.themoviedb.org/3/genre/tv/list';

  try {
    const response = await fetch(GenreListUrl, options);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Genre results:', error);
    res.status(500).json({ error: 'Error fetching Genre results' });
  }
  
});

//getting genre id and sending list based on genre
app.post('/api/selectedGenre/:genreId', async (req, res) => {
  const genreId = req.params.genreId;

  const tvShowsByGenreUrl = `https://api.themoviedb.org/3/discover/tv?with_genres=${genreId}`;

  try {
    const response = await fetch(tvShowsByGenreUrl, options);
    const data = await response.json();
    const tvShowsByGenre = data.results;
    res.json(tvShowsByGenre);
  } catch (error) {
    console.error('Error fetching TV shows by genre:', error);
    res.status(500).json({ error: 'Error fetching TV shows by genre' });
  }
});

//getting show details 
app.post('/api/showDetails', async (req, res) => {
  try {
    const { tvShowId, tvShowName } = req.body;

    console.log( "server" + tvShowId)

    // Send a request to the Movie DB API using the tvShowId
    const movieDBApiUrl = `https://api.themoviedb.org/3/tv/${tvShowId}`;
    const movieDBResponse = await fetch(movieDBApiUrl, options);
    const movieDBData = await movieDBResponse.json();

    //Send a request to YouTube using the tvShowName
    const apiKey2 = 'AIzaSyC-KimscI4JBw9dAyJu2OullWrxjsQoDXQ'; // Replace with your YouTube API key
    const showTitle = encodeURIComponent(tvShowName);
    const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey2}&type=video&part=snippet&q=${showTitle} trailer&maxResults=3`;
    const youtubeResponse = await fetch(youtubeApiUrl, options);
    const youtubeData = await youtubeResponse.json();

    console.log(movieDBData);
    console.log(youtubeData);
    //sending response from both API
    res.json({
      movieDB: movieDBData,
      youtube: youtubeData,
    });

  } catch (error) {
    console.error('Error fetching TV shows or YouTube videos:', error);
    res.status(500).json({ error: 'Error fetching TV shows or YouTube videos' });
  }
});


//Adding to wish lists
app.post('/api/addToWishlist', async (req, res) => {
  const data = req.body; // This will contain the TV show ID and User ID

  try {
    await client.connect();
    const db = client.db('BananaBinge');
    // Insert the TV show into the wish list collection
    const wishListCollection = db.collection('wishLists');
    const result = await wishListCollection.insertOne(data);
    
    client.close();
    if (result) {
      res.status(200).json({ message: 'Added' });
    } else {
      res.status(500).json({ message: 'Failed to add to wish list' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//Fetching data for wishlists
app.get('/api/wishlist', async (req, res) => {
  const userId = req.query.userId; 
  console.log("UserID" +userId);
  await client.connect();
  const db = client.db('BananaBinge');
  // Insert the TV show into the wish list collection

  try {
    const wishListCollection = db.collection('wishLists');
    const wishListData = await wishListCollection.find({ UserId: userId }).toArray();
    res.status(200).json(wishListData);
    console.log(wishListData);
  } catch (error) {
    console.error('Error fetching wish list data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Import required modules and set up your Express app

// Endpoint to remove a TV show from a user's wish list
app.post('/api/removeFromWishlist', async (req, res) => {
  const { userId, tvShowId } = req.body;

  console.log("API wishlist called");
  console.log(userId);
  console.log(tvShowId);

  try {
    await client.connect();
    const db = client.db('BananaBinge');

    // Access the wish list collection
    const wishListCollection = db.collection('wishLists');

    // Remove the TV show from the wish list
    const result = await wishListCollection.deleteOne({ UserId: userId, tvShowId: tvShowId });

    console.log(result);
    client.close();

    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'TV show removed from wish list' });
    } else {
      res.status(404).json({ message: 'TV show not found in wish list' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



//Admin Panel
app.get('/api/users', async (req, res) => {
  try {
    console.log("admin called users")
    await client.connect();
    const db = client.db('BananaBinge');
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();

    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
  
});


app.delete('/api/deleteUser/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log(userId)
  try {
    await client.connect();
    const db = client.db('BananaBinge');
    const userCollection = db.collection('users');

    const userIdObject = new ObjectId(userId);
    console.log(userIdObject);
    // Delete the user by ID
    const deletionResult = await userCollection.deleteOne({ _id: userIdObject });

    console.log(deletionResult);
    if (deletionResult.deletedCount === 0) {
      
      return res.status(404).json({ message: 'User not found' });
    }

    client.close();

    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
