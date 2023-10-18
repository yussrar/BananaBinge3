import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserProvider from './UserProvider';
import Header from './Header';
import Search from './Search';
import Genre from './Genre';
import ShowCards from './ShowCards';
import Footer from './Footer';
import Lists from './Lists';
import Details from './Details';
import Register from './Register';
import Login from './Login';
import Logout from './Logout';
import Admin from './Admin'
import Wishlist from './WishList';
import Profile from './Profile';
import About from './About'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <Router>
      <UserProvider>
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<div> <Search /> <Genre /> <ShowCards /> </div>} />
            <Route path="/Lists" element={<Lists />} />
            <Route path="/Details" element={<Details />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Logout" element={<Logout />} />
            <Route path="/WishList" element={<Wishlist />} />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/About" element={<About />} />
          </Routes>
          <Footer />
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
