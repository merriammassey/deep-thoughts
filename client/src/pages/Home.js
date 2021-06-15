import React from "react";
//import useQuery hook from Apollo Client to make requests to gql server made available through ApolloProvider component in App.js
import { useQuery } from "@apollo/client";
import { QUERY_THOUGHTS } from "../utils/queries";
import ThoughtList from "../components/ThoughtList";

const Home = () => {
  // use useQuery hook to make query request
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  //optional chaining negates need to check if object exists
  //if data exists, store it in thoughts constant, if it is undefinfed, save empty array
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  return (
    <main>
      <div className="flex-row justify-space-between">
        <div className="col-12 mb-3">
          {loading ? (
            //use ternary operator to conditionally render component
            <div>Loading...</div>
          ) : (
            <ThoughtList
              thoughts={thoughts}
              title="Seme Feed for Thought(s)..."
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
