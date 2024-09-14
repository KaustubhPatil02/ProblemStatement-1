import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function SessionDetail() {
  const { id } = useParams();
  const [sessionDetail, setSessionDetail] = useState(null);

  useEffect(() => {
    const savedClasses = JSON.parse(localStorage.getItem('classes')) || [];
    const session = savedClasses.flatMap(cls => cls.units)
      .flatMap(unit => unit.sessions)
      .find(sess => sess.id === parseInt(id));
    setSessionDetail(session);
  }, [id]);

  if (!sessionDetail) return <div>Loading...</div>;

  return (
    <div>
      <h1>{sessionDetail.name}</h1>
      <h2>Lectures:</h2>
      <ul>
        {sessionDetail.lectures.map((lecture) => (
          <li key={lecture.id}>
            <Link to={`/lectures/${lecture.id}`}>{lecture.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SessionDetail;
