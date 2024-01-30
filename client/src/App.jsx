import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { ChatContextProvider } from "./context/ChatContext";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <ChatContextProvider user={user && user}>
        <div className="bg-[#dddedd] h-screen flex items-center justify-center">
          {/* <Navbar/> */}
          <Routes>
            <Route
              exact
              path="/register"
              element={user ? <Navigate to="/login" /> : <Register />}
            />
            <Route
              exact
              path="/"
              element={user ? <Chat /> : <Navigate to="/login" />}
            />
            <Route
              exact
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            />
            <Route exact path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </ChatContextProvider>
    </>
  );
}

export default App;
