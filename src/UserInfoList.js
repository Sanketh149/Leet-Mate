import React, { useState } from "react";
import "./UserList.css"; // Assuming you saved the CSS code in a file called UserList.css

const UserList = () => {
  const [usernames, setUsernames] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setUsernames([...usernames, inputValue]);
    setInputValue("");
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="container">
      <div className={`navbar ${isOpen ? "" : "closed"}`}>
        <nav>
          <ul>
            {usernames.map((username, index) => (
              <li key={index}>{username}</li>
            ))}
          </ul>
        </nav>
        <button className="toggle-btn" onClick={toggleNavbar} />
      </div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter LeetCode username"
          />
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
  );
};

export default UserList;
