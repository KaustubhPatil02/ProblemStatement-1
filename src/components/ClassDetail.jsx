import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Comment from './Comment';

function ClassDetail() {
  const { id } = useParams();
  const [classDetail, setClassDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchClassDetail = async () => {
      try {
        const docRef = doc(db, 'classes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setClassDetail(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching class detail: ', error);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsRef = collection(db, 'classes', id, 'comments');
        const q = query(commentsRef);
        const querySnapshot = await getDocs(q);
        const commentsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setComments(commentsList);
      } catch (error) {
        console.error('Error fetching comments: ', error);
      }
    };

    fetchClassDetail();
    fetchComments();
  }, [id]);

  const addComment = async (parentId, text) => {
    const newComment = {
      text,
      parentId,
      replies: []
    };
    try {
      const commentsRef = collection(db, 'classes', id, 'comments');
      const docRef = await addDoc(commentsRef, newComment);
      newComment.id = docRef.id;
      if (parentId) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === parentId
              ? { ...comment, replies: [...comment.replies, newComment] }
              : comment
          )
        );
      } else {
        setComments((prevComments) => [...prevComments, newComment]);
      }
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  const handleAddComment = () => {
    addComment(null, commentText);
    setCommentText('');
  };

  if (!classDetail) return <div>Loading...</div>;

  return (
    <div>
      <h1>{classDetail.name}</h1>
      <h2>Units:</h2>
      <ul>
        {classDetail.units ? (
          classDetail.units.map((unit) => (
            <li key={unit.id}>
              <Link to={`/sessions/${unit.id}`}>{unit.name}</Link>
            </li>
          ))
        ) : (
          <li>No units available</li>
        )}
      </ul>
      <h2>Comments:</h2>
      <div>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleAddComment}>Submit</button>
      </div>
      <div>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} addReply={addComment} />
        ))}
      </div>
    </div>
  );
}

export default ClassDetail;