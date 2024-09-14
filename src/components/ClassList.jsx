import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function ClassList() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'classes'));
        const classList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClasses(classList);
      } catch (error) {
        console.error('Error fetching classes: ', error);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div>
      <h1>Class List</h1>
      <ul>
        {classes.map((classItem) => (
          <li key={classItem.id}>
            <Link to={`/classes/${classItem.id}`}>{classItem.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClassList;