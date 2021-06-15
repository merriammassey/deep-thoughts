import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import React from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";

const httpLink = createHttpLink({
  uri: "/graphql",
});

//establish connection to back end servier's graphql endpoint
const client = new ApolloClient({
  //establish new link to gql server
  link: httpLink,
  //instantiate a new cache object
  cache: new InMemoryCache(),
});

//wrap JSX in AProvider to pass client variable in
function App() {
  return (
    <ApolloProvider client={client}>
      <div className="flex-column justify-flex-start min-100-vh">
        <Header />
        <div className="container">
          <Home />
        </div>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
