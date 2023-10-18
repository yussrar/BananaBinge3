import React from 'react';
import './About.css'; // Import your CSS file

function About() {
    return (
        <div className="about-container">
            <h2 className="heading">About Us: Your TV Show Companion</h2>
            <p className="text">
                Welcome to our corner of the internet, where we believe that watching TV should be an adventure, not a chore. Just like "Banana Binge," we're here to make your TV show experience unforgettable.
            </p>
            <p className="text">
                At Your TV Show Companion, we're on a mission to help you discover, organize, and enjoy your favorite TV shows effortlessly. Our platform is powered by the magic of the TMDb and YouTube APIs, offering you a seamless way to search for shows by name and genre. But that's just the beginning. With us, you can create and manage your wish lists, ensuring you never forget a show you want to watch. We're all about making your TV time stress-free and fun.
            </p>
            <p className="text">
                So whether you're a seasoned TV series addict or just looking for your next binge-worthy adventure, Your TV Show Companion is here to serve you. Let us be your trusted guide through the world of television, ensuring you never miss a moment of entertainment. Happy watching!
            </p>
        </div>
    );
}

export default About;
