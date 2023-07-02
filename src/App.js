import "./App.css";
import React, { useEffect, useState } from "react";
import Header from "./Components/Header";
import ErrorMessage from "./Components/ErrorMessage";
import NoCharacter from "./Components/NoCharacter";
import AboveMessage from "./Components/AboveMessage";
import ProblemList from "./Components/ProblemList";
const API_ENDPOINT = "https://unusual-erin-housecoat.cyclic.app/";

const App = () => {
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [cartIsShown, setCartIsShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const displayTitle = (name, item, titleSlug) => {
    setUserData((prevUserData) => {
      const existingMap = new Map(
        prevUserData.map(([title, slug, solvedBy, variableNames]) => [
          slug,
          [title, slug, solvedBy, variableNames],
        ])
      );
      const newMap = new Map(
        item.map((title, index) => {
          const slug = titleSlug[index];
          const existingEntry = existingMap.get(slug);
          if (existingEntry) {
            const [existingTitle, existingSlug, solvedBy, variableNames] =
              existingEntry;
            return [
              slug,
              [
                existingTitle,
                existingSlug,
                [...solvedBy, name],
                [...variableNames, name],
              ],
            ];
          }
          return [slug, [title, slug, [name], [name]]];
        })
      );
      const mergedMap = new Map([...existingMap, ...newMap]);
      const userDataWithNames = Array.from(mergedMap.values());
      return userDataWithNames;
    });
  };

  const fetchUserData = async (username) => {
    const url = `${API_ENDPOINT}${userName}`;

    try {
      setIsLoading(true);
      const response = await fetch(url);
      const result = await response.json();

      const titles = result.recentAcSubmissionList.map(
        (submission) => submission.title
      );
      const titleSlugs = result.recentAcSubmissionList.map(
        (submission) => submission.titleSlug
      );

      displayTitle(username, titles, titleSlugs);

      if (username.length > 0 && !userIds.includes(username.toLowerCase())) {
        setUserIds((prevState) => [...prevState, username.toLowerCase()]);
      }
      setIsLoading(false);
      setUserName("");
    } catch (error) {
      setIsLoading(false);
      setCartIsShown(true);
    }
  };
  const handleFormSubmit = (event) => {
    event.preventDefault();
    fetchUserData(userName);
  };

  const deleteHandler = async (event, item) => {
    event.preventDefault();
    const newIds = userIds.filter((value) => value !== item);
    setUserIds(newIds);
    setUserData((prevUserData) =>
      prevUserData.filter(([, , solvedBy]) => !solvedBy.includes(item))
    );
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
            <div>
              <a href={`https://leetcode.com/${item}`} target="_blank">
                <button className="displayNameButton">{item}</button>
              </a>
              <button
                className="displayNameButtonNext"
                onClick={(event) => deleteHandler(event, item)}
              >
                {" "}
                X{" "}
              </button>
            </div>
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
