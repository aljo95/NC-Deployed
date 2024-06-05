import './App.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Register() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [titleString, setTitleString] = useState("Register Account");
  const [timer, setTimer] = useState("");

  const navigate = useNavigate();

  const handleuserChange = (e) => {
    setUsername(e.target.value);
  }
  const handlepwChange = (e) => {
    setPassword(e.target.value);
  }

  const handleForm = (e) => {
    
    console.log(username);
    e.preventDefault();
    
    const userData = {
      username: username,
      password: password,
    };
    setTitleString("Registering...")
     //fetch('http://localhost:8080/api/register', {
      fetch('/api/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);

        //this is for registering, we want to redirect on login
        if (data.message === "success") {
          //navigate("/login");
          /* Auto login function after successful registration */
          setTitleString("Logging in...")
          autoLogin(userData.username, userData.password);
        } else if (data.message === "stillTimer") {
          setTitleString("Registering opens in: ")  //maybe get time left or something
          let timeInMins = Math.floor((data.currTime / 60)+1)
          setTimer(timeInMins.toString() + "m")
          if (window.innerWidth <= 830)
            alert("Registering opens in: " + timer + ".")
        } else if(data.message === "exists") {
          setTitleString("Account already exists")
          setTimer("")
          if (window.innerWidth <= 830)
            alert("Account already exists.")
        }

      });
  };
  const handleClick = () => {
    navigate("/");
  }

  const autoLogin = (name, pw) => {

    const userData = {
      username: name,
      password: pw,
    };

    fetch('/api/login', {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    .then(res => {
      console.log(res);
      if (res.ok) {
        //alert("GOOD JOB XD");

        navigate("/Profile");

      } else {
        alert("Something went wrong!");
      }
      
    })
  }

  return (  /* on register account make state which changes to registering... or registering failed and shit */
  <>
    <div className="register">
      <h2 id='register-welcome'><p id="reg-p">{titleString} {timer}</p></h2> 
        <form className='register-form' onSubmit={handleForm}>
            <label>Username: </label>
            <input className='inputs' type='text' name='username' value={username} onChange={handleuserChange}></input>
            <label>Password: </label>
            <input id="bottom-input" className='inputs' type='password' name='password' value={password} onChange={handlepwChange}></input>
            <div className="form-btns-container">
              <button id='reg-btn' className='btns' type='submit'>Register</button>
              <button id="back-btn" className="btns" onClick={handleClick} type="button">Back</button>
            </div>
        </form>
    </div>
  </>
  );
}