import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { NavBar } from "./features/Nav/NavBar";
import { Reward } from "./features/Reward/Reward";
import { initialize } from "./features/User/userSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initialize());
  }, [dispatch]);

  return (
    <div className="bg-dark App">
      <NavBar />
      <Reward />
      <ToastContainer />
    </div>
  );
}

export default App;
