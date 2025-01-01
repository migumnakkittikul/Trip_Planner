import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar';
import UserPlans from './Components/UserPlans';
import UserPlanDetails from './Components/UserPlanDetails';
import LoginSignup from './Components/LoginSignup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddSegmentPage from './Components/AddSegmentPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route exact path="/users/:id/plans" element={<UserPlans/>}/>
        <Route exact path="/plans/:id" element={<UserPlanDetails/>}/>
        <Route exact path="/plans/:id/segments" element={<AddSegmentPage/>}/>
      </Routes>
    </div>
    <ToastContainer />
    </>
  );
}

export default App;
