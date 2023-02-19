import React, { useEffect } from "react";
import "./App.css";
import { NavBar } from "./features/Nav/NavBar";
import { Reward } from "./features/Reward/Reward";
import {useDispatch} from 'react-redux'
import { initialize } from "./features/User/userSlice";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initialize())
  }, [dispatch])

  return (
    <div className="bg-dark App">
      <NavBar />
      <Reward />
      <ToastContainer />
    </div>
  );
}

export default App;
