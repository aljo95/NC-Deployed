import './App.css';
import React  from 'react';
import { useNavigate } from "react-router-dom";

export default function Home() {

  const navigate = useNavigate();

  return (
    <div className="home">
      <h2 id='welcome'><p>NodeChat</p></h2>
      <div id="home-links">
          <button id="login" onClick={() => navigate("/login")}>
            <p>LOGIN</p>
          </button>

          <button id="register" onClick={() => navigate("/register")}>
            <p>REGISTER</p>
          </button>
      </div>
      
    </div>
  );
}

