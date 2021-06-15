import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import NoMatch from "./pages/NoMatch";
import SingleThought from "./pages/SingleThought";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
//middleware function to retrieve toekn and combine it with httpLink
import { setContext } from "@apollo/client/link/context";

import React from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";

const httpLink = createHttpLink({
  uri: "/graphql",
});

//function to add token to httpLink
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

//establish connection to back end servier's graphql endpoint
const client = new ApolloClient({
  //establish new link to gql server...combine autLink and httpLink so every request retrieves token and sets request headers before amking the request to API
  link: authLink.concat(httpLink),
  //instantiate a new cache object
  cache: new InMemoryCache(),
});

//wrap JSX in AProvider to pass client variable in
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/profile/:username?" component={Profile} />
              <Route exact path="/thought/:id" component={SingleThought} />
              <Route component={NoMatch} />
            </Switch>{" "}
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
