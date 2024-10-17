import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Subscription from "./components/Subcription.jsx";
import InitiatePayment from "./components/InitiatePayment.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/payment" element={<InitiatePayment />} />
      </Routes>
    </Router>
  );
}

export default App;
