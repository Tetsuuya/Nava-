import React from "react";
import Homepage from "./pages/Dashboard/homepage";
import Header from "./components/Header/header";
import Sidebar from "./components/Sidebar/sidebar";
import Scratchpad from "./pages/Scratchpad/scratchpad";
import Favorites from "./pages/Favorites/favorites";
import Trash from "./pages/Trash/trash";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import { useAuth, AuthProvider } from "./context/authcontext";
import { NotesProvider } from "./context/notescontext";

const AppContent: React.FC = () => {
  const { userLoggedIn } = useAuth();

  const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    if (!userLoggedIn) return <Navigate to="/login" replace />;
    return children;
  };

  const RedirectIfAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    if (userLoggedIn) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {userLoggedIn && <Header />}
      <div className="flex flex-1">
        {userLoggedIn && <Sidebar />}
        <main className="flex-1 min-w-0">
          <Routes>
            <Route
              path="/login"
              element={
                <RedirectIfAuth>
                  <Login />
                </RedirectIfAuth>
              }
            />
            <Route
              path="/signup"
              element={
                <RedirectIfAuth>
                  <Signup />
                </RedirectIfAuth>
              }
            />

            <Route
              path="/"
              element={
                <RequireAuth>
                  <Homepage />
                </RequireAuth>
              }
            />
            <Route
              path="/ScratchPad"
              element={
                <RequireAuth>
                  <Scratchpad />
                </RequireAuth>
              }
            />
            <Route
              path="/Favorites"
              element={
                <RequireAuth>
                  <Favorites />
                </RequireAuth>
              }
            />
            <Route
              path="/Trash"
              element={
                <RequireAuth>
                  <Trash />
                </RequireAuth>
              }
            />

            <Route path="*" element={<Navigate to={userLoggedIn ? "/" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <NotesProvider>
          <AppContent />
        </NotesProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
