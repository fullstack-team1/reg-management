import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import Dash from './pages/dashboard';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path="/dashboard" element={<Dash />}/>
        </Routes>
      </Router>
        
    </>
  )
}

export default App