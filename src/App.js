import React, { useState } from "react";
import "./App.css";
import Cart from "./Cart";
import Img from "./logo.png";

const API_ENDPOINT = "https://unusual-erin-housecoat.cyclic.app/";

const App = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState([]);
  const [leetId, setLeetId] = useState([]);
  const [cartIsShown, setCartIsShown] = useState(false);

  const displayTitle = (item, titleSlug) => {
    const existingTitles = user.map((innerArray) => innerArray[0]);
    const existingSlugs = user.map((innerArray) => innerArray[1]);
    const uniqueTitles = [...new Set([...existingTitles, ...item])];
    const uniqueSlugs = [...new Set([...existingSlugs, ...titleSlug])];

    const uniquePairs = uniqueSlugs.map((slug, index) => {
      return [uniqueTitles[index], slug];
    });

    setUser(uniquePairs);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const url = `${API_ENDPOINT}${username}`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      const titles = result.recentAcSubmissionList.map(
        (submission) => submission.title
      );
      const titleSlugs = result.recentAcSubmissionList.map(
        (submission) => submission.titleSlug
      );

      displayTitle(titles, titleSlugs);

      if (username.length > 0 && !leetId.includes(username)) {
        setLeetId((prevState) => [...prevState, username]);
      }

      setUsername("");
    } catch (error) {
      setCartIsShown(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleFormSubmit(event);
  };

  const showCartHandler = () => {
    setCartIsShown(true);
  };

  const hideCartHandler = () => {
    setCartIsShown(false);
    setUsername("");
  };

  const isSubmitDisabled = username.trim().length === 0;

  return (
    <div className="app">
      {cartIsShown && <Cart onClose={hideCartHandler} shownName={username} />}
      <div className="app__navbar">
        <span className="leetmate">
          &nbsp;&nbsp;&nbsp;
          <img src={Img} alt="logo" width="20" height="20" />
          &nbsp; LEETMATE
        </span>
        <p className="problemCount">
          &nbsp;&nbsp;&nbsp; Problem Count: {user.length}
          &nbsp;&nbsp;&nbsp;
        </p>
      </div>

      <div className="app__content">
        <div className="app__sidebar">
          <form onSubmit={handleSubmit} className="app__form">
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter Leetcode ID"
              className="app__input"
            />
            {isSubmitDisabled && (
              <div className="errorShow">*Enter at least one character</div>
            )}
            <button
              type="submit"
              className={`${
                isSubmitDisabled ? "app__button_disabled" : "app__button"
              }`}
              disabled={isSubmitDisabled}
            >
              Add Friend
            </button>
          </form>
          {leetId.map((item) => (
            <a href={`https://leetcode.com/${item}`} target="_blank">
              <button className="displayNameButton">{item}</button>
            </a>
          ))}
        </div>
        <div className="app__problem-list">
          {user.length > 0 && (
            <div className="app__above_message">
              <b>
                {" "}
                Provided below are the links problems solved by other users :
              </b>
            </div>
          )}
          {user.length > 0 ? (
            <ul>
              {user.map((item, index) => (
                <div>
                  <li key={index}>
                    <a
                      href={`https://leetcode.com/problems/${item[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item[0]}
                    </a>
                  </li>
                </div>
              ))}
            </ul>
          ) : (
            <p className="app__message">Your problems list will appear here</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
