import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [user, loading] = useAuthState(auth);
  const [userRole, setUserRole] = React.useState(null);
  const [roleLoading, setRoleLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
        setRoleLoading(false);
      }
    };
    fetchUserRole();
  }, [user]);

  if (loading || roleLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner
  }

  if (!user || (requiredRole && userRole !== requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;