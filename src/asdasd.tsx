import React from "react";
import Homepage from "./pages/Dashboard/homepage";
import Header from "./components/Header/header";
import Sidebar from "./components/Sidebar/sidebar";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">
          <Homepage />
        </main>
      </div>
    </div>
  );
}

export default App;