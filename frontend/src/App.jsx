import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Users from "./pages/Users";


function App() {
const token = localStorage.getItem("token");

return ( <BrowserRouter> <Routes>
  <Route path="/users" element={<Users />} />



    <Route
      path="/"
      element={
        token ? (
          <Navigate to="/home" replace />
        ) : (
          <Navigate to="/login" replace />
        )
      }
    />

    <Route
      path="/login"
      element={<Login />}
    />

    <Route
      path="/register"
      element={<Register />}
    />

    <Route
      path="/home"
      element={
        token ? (
          <Home />
        ) : (
          <Navigate to="/login" replace />
        )
      }
    />

    <Route
      path="/profile"
      element={
        token ? (
          <Profile />
        ) : (
          <Navigate to="/login" replace />
        )
      }
    />

    <Route
      path="/create-post"
      element={
        token ? (
          <CreatePost />
        ) : (
          <Navigate to="/login" replace />
        )
      }
    />

    <Route
      path="*"
      element={<Navigate to="/" replace />}
    />

  </Routes>
</BrowserRouter>


);
}

export default App;
