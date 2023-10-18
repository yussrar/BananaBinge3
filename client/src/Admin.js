import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';
import { useUser } from './UserProvider'; 


function Admin() {
  const { user } = useUser();


  if(user){
  if (user.email === "yusra@admin.com" && user.password === "$2a$10$jBIKsNZ0hfT10psIsrHIH.U.bb5MBO0qu.RJn5TUbWBXm2loc58di") {
    return <AdminPanel />;}
  else {
    return <p>Not Authorized</p>;
  }
  }
  else{
    return <p>Please Login</p>;
  }
}
function AdminPanel()  {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    // Fetch a list of users from your server when the component mounts
    async function fetchUsers() {
      try {
        const response = await axios.get('https://banana-binge2.vercel.app/api/users'); // Replace with your server route
        const data = response.data;
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchUsers();
  }, []);

  console.log(users)

  const handleDeleteUser = async (userId) => {
    try {
      console.log("user deletion requested")
      // Send a request to your server to delete the selected user
      const response = await axios.delete(`https://banana-binge2.vercel.app/api/deleteUser/${userId}`); // Replace with your server route
      // Update the users list to reflect the deleted user
      console.log(response.data.message);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <div className="user-list">
        <h3>Users</h3>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.name} ----{user.email}
              <button onClick={() => setSelectedUserId(user._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      {selectedUserId && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this user?</p>
          <button onClick={() => handleDeleteUser(selectedUserId)}>Yes</button>
          <button onClick={() => setSelectedUserId(null)}>No</button>
        </div>
      )}
    </div>
  );
  
}

export default Admin;
