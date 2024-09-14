import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AddClass from './AddClass';

function ClassList() {
  const [classes, setClasses] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [newClassName, setNewClassName] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'classes'));
        const classesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClasses(classesList);
      } catch (error) {
        console.error('Error fetching classes: ', error);
      }
    };

    const fetchUserRole = async (userId) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } catch (error) {
        console.error('Error fetching user role: ', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserRole(user.uid);
        fetchClasses();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateClass = async (classId) => {
    try {
      const docRef = doc(db, 'classes', classId);
      await updateDoc(docRef, { name: newClassName });
      setClasses((prevClasses) =>
        prevClasses.map((classItem) =>
          classItem.id === classId ? { ...classItem, name: newClassName } : classItem
        )
      );
      setEditingClass(null);
      setNewClassName('');
      alert('Class updated successfully');
    } catch (error) {
      console.error('Error updating class: ', error);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      const docRef = doc(db, 'classes', classId);
      await deleteDoc(docRef);
      setClasses((prevClasses) => prevClasses.filter((classItem) => classItem.id !== classId));
      alert('Class deleted successfully');
    } catch (error) {
      console.error('Error deleting class: ', error);
    }
  };

  return (
    <div>
      <h1>Class List</h1>
      {userRole === 'admin' && <AddClass />}
      <ul>
        {classes.map((classItem) => (
          <li key={classItem.id}>
            <Link to={`/classes/${classItem.id}`}>{classItem.name}</Link>
            {userRole === 'admin' && (
              <div>
                {editingClass === classItem.id ? (
                  <div>
                    <input
                      type="text"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      placeholder="New Class Name"
                    />
                    <button onClick={() => handleUpdateClass(classItem.id)}>Save</button>
                    <button onClick={() => setEditingClass(null)}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <button onClick={() => setEditingClass(classItem.id)}>Edit</button>
                    <button onClick={() => handleDeleteClass(classItem.id)}>Delete</button>
                  </div>
                )}
            
              </div>
              
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClassList;