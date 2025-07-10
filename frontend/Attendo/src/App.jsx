import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dash from './pages/Dashboard';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="login/" element={<Login />}/>
          <Route path="signup/" element={<Signup />}/>
          <Route path="/" element={<Dash />}/>
        </Routes>
      </Router>
        
    </>
  )
}

export default App
