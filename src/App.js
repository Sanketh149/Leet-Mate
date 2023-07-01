import "./App.css";
import React, { useState } from "react";
import Header from "./Components/Header";
import ErrorMessage from "./Components/ErrorMessage";
import NoCharacter from "./Components/NoCharacter";
import AboveMessage from "./Components/AboveMessage";
import ProblemList from "./Components/ProblemList";
const API_ENDPOINT = "/graphql";

const App = () => {
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [cartIsShown, setCartIsShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const displayTitle = (item, titleSlug) => {
    const existingTitles = userData.map((innerArray) => innerArray[0]);
    const existingSlugs = userData.map((innerArray) => innerArray[1]);
    const uniqueTitles = [...new Set([...existingTitles, ...item])];
    const uniqueSlugs = [...new Set([...existingSlugs, ...titleSlug])];

    const uniquePairs = uniqueSlugs.map((slug, index) => {
      return [uniqueTitles[index], slug];
    });

    setUserData(uniquePairs);
    
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const query = `
      {
        recentAcSubmissionList(username: "${userName}") {
          id
          title
          titleSlug
        }
      }
    `;

    const url = `${API_ENDPOINT}?query=${encodeURIComponent(query)}`;

    try {
      setIsLoading(true);
      const response = await fetch(url);
      const result = await response.json();

      const titles = result.data.recentAcSubmissionList.map(
        (submission) => submission.title
      );
      const titleSlugs = result.data.recentAcSubmissionList.map(
        (submission) => submission.titleSlug
      );

      displayTitle(titles, titleSlugs);

      if (userName.length > 0 && !userIds.includes(userName.toLowerCase())) {
        setUserIds((prevState) => [...prevState, userName.toLowerCase()]);
      }
      setIsLoading(false);
      setUserName("");
    } catch (error) {
      setIsLoading(false);
      setCartIsShown(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleFormSubmit(event);
  };

  const hideCartHandler = () => {
    setCartIsShown(false);
    setUserName("");
  };

  const isSubmitDisabled = userName.trim().length === 0;

  return (
    <div className="app">
      {cartIsShown && (
        <ErrorMessage onClose={hideCartHandler} shownName={userName} />
      )}
      <Header numberOfProblems={userData.length} />
      <div className="app__content">
        <div className="app__sidebar">
          <form onSubmit={handleSubmit} className="app__form">
            <input
              type="text"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              placeholder="Enter Leetcode ID"
              className="app__input"
            />
            {isSubmitDisabled && <NoCharacter />}
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
          {isLoading && <p>Loading data ...</p>}

          {userIds.map((item) => (
            <a href={`https://leetcode.com/${item}`} target="_blank">
              <button className="displayNameButton">{item}</button>
            </a>
          ))}
        </div>
        <div className="app__problem-list">
          <AboveMessage userData={userData} />
          <ProblemList userData={userData} />
        </div>
      </div>
    </div>
  );
};
export default App;
