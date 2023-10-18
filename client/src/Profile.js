import React from 'react';
import { useUser } from './UserProvider';

function Profile() {
    const { user } = useUser();

    if(user){
    return (
        <div>
            <p>Name: {user.name}</p>
            <p>Email: {user.email} </p>
        </div>
    );}
    else{
        return (
        <p>Please Log in</p>
        );
    }
}

export default Profile;