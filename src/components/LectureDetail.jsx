import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import Comment from './Comment';

function LectureDetail() {
  const { id } = useParams(); // Assuming id is the lecture ID
  const [lectureDetail, setLectureDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchLectureDetail = async () => {
      try {
        const docRef = doc(db, 'lectures', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLectureDetail(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching lecture detail: ', error);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsRef = collection(db, 'lectures', id, 'comments');
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

    fetchLectureDetail();
    fetchComments();
  }, [id]);

  const addComment = async (parentId, text) => {
    const newComment = {
      text,
      parentId,
      replies: []
    };
    try {
      const commentsRef = collection(db, 'lectures', id, 'comments');
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

  if (!lectureDetail) return <div>Loading...</div>;

  return (
    <div>
      <h1>{lectureDetail.title}</h1>
      <div>
        <h2>Description:</h2>
        <p>{lectureDetail.description}</p>
        {/* Add additional content rendering here (e.g., videos, documents) */}
      </div>
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

export default LectureDetail;
