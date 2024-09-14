import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ClassList from './components/ClassList';
import ClassDetail from './components/ClassDetail';
import SessionDetail from './components/SessionDetail';
import LectureDetail from './components/LectureDetail';
import Login from './components/Login';
import AddClass from './components/AddClass';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/classes" element={<ClassList />} />
        <Route path="/addclass" element={<AddClass />} />
        <Route path="/classes/:id" element={<ClassDetail />} />
        <Route path="/sessions/:id" element={<SessionDetail />} />
        <Route path="/lectures/:id" element={<LectureDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
