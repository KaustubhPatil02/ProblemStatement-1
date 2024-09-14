import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const handleLogout = async () => {
  try {
    await signOut(auth);
    alert('Logged out successfully');
    // Optionally, redirect to the login page or home page
    // navigate('/login');
  } catch (error) {
    console.error('Error logging out: ', error);
  }
};

function Dashboard() {
  return (
    <>
      <div>
        <h1>Virtual Classroom Dashboard</h1>
        <Link to="/classes">View Classes</Link>
      </div>

      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

export default Dashboard;
