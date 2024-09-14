import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function LectureDetail() {
  const { id } = useParams();
  const [lectureDetail, setLectureDetail] = useState(null);

  useEffect(() => {
    const savedClasses = JSON.parse(localStorage.getItem('classes')) || [];
    const lecture = savedClasses.flatMap(cls => cls.units)
      .flatMap(unit => unit.sessions)
      .flatMap(session => session.lectures)
      .find(lec => lec.id === parseInt(id));
    setLectureDetail(lecture);
  }, [id]);

  if (!lectureDetail) return <div>Loading...</div>;

  return (
    <div>
      <h1>{lectureDetail.title}</h1>
      <p>{lectureDetail.content}</p>
      <h2>Discussion:</h2>
      {/* Add discussion handling here */}
    </div>
  );
}

export default LectureDetail;

