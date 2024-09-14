import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function AddClass() {
  const [className, setClassName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with class name:', className);
    try {
      const docRef = await addDoc(collection(db, 'classes'), { name: className });
      console.log('Document written with ID: ', docRef.id);
      setClassName('');
      alert('Class added successfully');
    } catch (error) {
      console.error('Error adding class: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        placeholder="Class Name"
        required
      />
      <button type="submit">Add Class</button>
    </form>
  );
}

export default AddClass;