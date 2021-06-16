import React from "react";
import FriendList from "../components/FriendList";
import ThoughtList from "../components/ThoughtList";
import { QUERY_USER, QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth";
import { Redirect, useParams } from "react-router-dom";
import { ADD_FRIEND } from "../utils/mutations";
import { useQuery, useMutation } from "@apollo/client";
import ThoughtForm from "../components/ThoughtForm";

const Profile = () => {
  const { username: userParam } = useParams();

  //if there's a value in userParam from url bar, add that value to run Query_user query
  //if there's no value, execute query_me query instead
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });
  //when query_me is run, repsonse returns our data; query_user returns data in user property
  const user = data?.me || data?.user || {};
  const [addFriend] = useMutation(ADD_FRIEND);

  //check if loged in user username is same as parameter and redirect if so
  // redirect to personal profile page if username is the logged-in user's
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Redirect to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  //if there is no user data to display because user is not logged in, ask user to log in
  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links
        above to sign up or log in!
      </h4>
    );
  }

  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex-row mb-3">
        {/* updated to conditionally render code regarding whose profile is being viewed */}
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : "your"} profile.
        </h2>
        {userParam && (
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList
            thoughts={user.thoughts}
            title={`${user.username}'s thoughts...`}
          />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
      {/* render thought form ...use userParam to only do so on the user's own profile page */}
      <div className="mb-3">{!userParam && <ThoughtForm />}</div>
    </div>
  );
};

export default Profile;
