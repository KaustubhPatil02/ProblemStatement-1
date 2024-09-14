import React, { useState } from 'react';
import { doc, deleteDoc, query, where, getDocs, collection } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function UnenrollButton({ classId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUnenroll = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (user) {
        // Find the enrollment document
        const enrollmentQuery = query(
          collection(db, 'enrollments'),
          where('userId', '==', user.uid),
          where('classId', '==', classId)
        );
        const enrollmentSnapshot = await getDocs(enrollmentQuery);
        if (!enrollmentSnapshot.empty) {
          const enrollmentDoc = enrollmentSnapshot.docs[0];
          await deleteDoc(doc(db, 'enrollments', enrollmentDoc.id));
          alert('Successfully unenrolled from the class.');
          navigate(0); // Refresh the page to update the enrollment status
        } else {
          alert('You are not enrolled in this class.');
        }
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      console.error('Error unenrolling: ', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleUnenroll} disabled={loading}>
        {loading ? 'Unenrolling...' : 'Unenroll'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default UnenrollButton;