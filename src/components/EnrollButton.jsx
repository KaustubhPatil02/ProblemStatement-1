import React from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

function EnrollButton({ classId }) {
  const handleEnroll = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert('You must be logged in to enroll.');
      return;
    }

    try {
      // Check if already enrolled
      const enrollmentQuery = query(
        collection(db, 'enrollments'),
        where('userId', '==', user.uid),
        where('classId', '==', classId)
      );

      const enrollmentSnapshot = await getDocs(enrollmentQuery);
      if (enrollmentSnapshot.empty) {
        // Add enrollment
        await addDoc(collection(db, 'enrollments'), {
          userId: user.uid,
          classId: classId,
        });
        alert('Successfully enrolled in the class.');
      } else {
        alert('You are already enrolled in this class.');
      }
    } catch (error) {
      console.error('Error enrolling in class: ', error);
    }
  };

  return <button onClick={handleEnroll}>Enroll</button>;
}

export default EnrollButton;
