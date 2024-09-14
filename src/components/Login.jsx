import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await addUserToFirestore(user);
      alert('Logged in successfully');
      navigate('/dashboard'); // Redirect to the dashboard
    } catch (error) {
      console.error('Error logging in: ', error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      await addUserToFirestore(user);
      alert('Logged in with Google successfully');
      navigate('/dashboard'); // Redirect to the dashboard
    } catch (error) {
      console.error('Error logging in with Google: ', error);
    }
  };

  const addUserToFirestore = async (user) => {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
      });
    } catch (error) {
      console.error('Error adding user to Firestore: ', error);
    }
  };

  return (
    <>
      <h1>Login to Virtual Classroom</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        <button type="button" onClick={handleGoogleLogin}>Login with Google</button>
      </form>
    </>
  );
}

export default Login;