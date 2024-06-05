import './App.css';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {

    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/checkAuth', {    // CHANGE ROUTES NOW :)
          credentials: "include",
        })
        .then((response) => {
          return response.json().then((jsonResponse) => {
            //console.log(jsonResponse);
            setUsername(jsonResponse.username)

            if (!jsonResponse.username) {
                //redirect back to home (root)
                navigate("/");
            }

          })
        })
    }, [])

    const logout = (e) => {
        fetch('/api/logout', {
          credentials: "include",
        })
        .then((res) => {
          return res.json().then((jsonRes) => {
            console.log(jsonRes);
            navigate("/");
          })
        })




        /*
        .then((response => {                    // LOGS OUT IN SERVER BUT FAILS TO RESPOND HERE AND REDIRECT. FIX!
            console.log("Logout response: ");
            console.log(response);
            navigate("/");
        }))
        */
    }


  return (
    <div id="profile-container">
      <h2 id='welcome'><p>Welcome {username}!</p></h2>
      <div id="home-links">
        <button id="profile-chat" onClick={() => navigate("/chat")}>
          <p>Lobby</p>
        </button>
        <button id="rooms-chat">
          <div className="tooltiptext-profile">Coming soon!</div>
          Rooms
        </button>
        <button id="profile-logout" onClick={logout}>
          <p>Logout</p>
        </button>
      </div>
    </div>
  );
}