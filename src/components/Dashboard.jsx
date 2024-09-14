import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const handleLogout = async (navigate) => {
  try {
    await signOut(auth);
    alert('Logged out successfully');
    navigate('/'); // Redirect to the login page or home page
  } catch (error) {
    console.error('Error logging out: ', error);
    alert(`Error logging out: ${error.message}`);
  }
};

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <h1>Virtual Classroom Dashboard</h1>
        <Link to="/classes">View Classes</Link>
      </div>

      <button onClick={() => handleLogout(navigate)}>Logout</button>
    </>
  );
}

export default Dashboard;