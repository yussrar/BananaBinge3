
import { useUser } from './UserProvider'; // Import the user context
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const { setUser } = useUser();
    const navigate = useNavigate();


      // Remove the user from the context
      setUser(null);
      
      // Redirect to the desired page, for example, the home page '/'
      navigate('/');
    };
   

  export default Logout;
  