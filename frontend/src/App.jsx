import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<h1>Home Page</h1>} />

      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default App;
