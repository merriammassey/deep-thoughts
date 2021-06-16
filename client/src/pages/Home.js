import React from "react";
//import useQuery hook from Apollo Client to make requests to gql server made available through ApolloProvider component in App.js
import { useQuery } from "@apollo/client";
import ThoughtList from "../components/ThoughtList";
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from "../utils/queries";
import Auth from "../utils/auth";
import FriendList from "../components/FriendList";
import ThoughtForm from "../components/ThoughtForm";

const Home = () => {
  const loggedIn = Auth.loggedIn();

  // use useQuery hook to make query request
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  //retrieve logged in user's friend list
  // use object destructuring to extract `data` from the `useQuery` Hook's response and rename it `userData` to be more descriptive
  const { data: userData } = useQuery(QUERY_ME_BASIC);

  //optional chaining negates need to check if object exists
  //if data exists, store it in thoughts constant, if it is undefinfed, save empty array
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  return (
    <main>
      <div className="flex-row justify-space-between">
        {loggedIn && (
          <div className="col-12 mb-3">
            <ThoughtForm />
          </div>
        )}
        {/* conditional 2 column layout if user is logged in */}
        <div className={`col-12 mb-3 ${loggedIn && "col-lg-8"}`}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList
              thoughts={thoughts}
              title="Some Feed for Thought(s)..."
            />
          )}
        </div>
        {/* load friend list for users that are logged in */}
        {loggedIn && userData ? (
          <div className="col-12 col-lg-3 mb-3">
            <FriendList
              username={userData.me.username}
              friendCount={userData.me.friendCount}
              friends={userData.me.friends}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Home;
