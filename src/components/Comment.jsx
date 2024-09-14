import React, { useState } from 'react';

function Comment({ comment, addReply }) {
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = () => {
    addReply(comment.id, replyText);
    setReplyText('');
    setShowReplyForm(false);
  };

  return (
    <div style={{ marginLeft: comment.parentId ? '20px' : '0' }}>
      <p>{comment.text}</p>
      <button onClick={() => setShowReplyForm(!showReplyForm)}>
        {showReplyForm ? 'Cancel' : 'Reply'}
      </button>
      {showReplyForm && (
        <div>
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
          />
          <button onClick={handleReply}>Submit</button>
        </div>
      )}
      {comment.replies && comment.replies.map((reply) => (
        <Comment key={reply.id} comment={reply} addReply={addReply} />
      ))}
    </div>
  );
}

export default Comment;