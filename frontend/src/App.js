import './App.css';
import Login from './pages/Login';
import { Route, Routes, Navigate } from "react-router-dom";
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Refresh from './utils/Refresh';
import { PrivateRoute, ProtectedRoute } from './utils/Route';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Refresh />} >
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Signup />} />
          
          <Route element={<PrivateRoute />}>
            <Route index element={<Profile />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
        <Route path='*' element={<Navigate to='/' />}></Route>
      </Routes>
    </>
  );
}

export default App;
