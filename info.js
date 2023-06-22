import React, { useState } from "react";

const API_ENDPOINT = "/graphql";
let submissions = [];
const App = () => {
  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  // function doOtherAsyncThing() {
  //   return new Promise((resolve) => {
  //     setTimeout(() => resolve("it’s done!"), 500);
  //   });
  // }

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const query = `
      {
        recentAcSubmissionList(username: "${username}") {
          id
          title
        }
      }
    `;

      const url = `${API_ENDPOINT}?query=${encodeURIComponent(query)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      await setUserInfo({ ...userInfo, data });
    } catch (error) {
      console.error("Error:", error);
      // Handle error cases
    }
  };
  const handleSubmit = (event) => {
    handleFormSubmit(event);
    submissions.push(userInfo);
    console.log(userInfo);
  };
  return (
    <div>
      <h1>User Information</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter username"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default App;
