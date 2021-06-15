const path = require("path");
const express = require("express");
const db = require("./config/connection");
// import ApolloServer
const { ApolloServer } = require("apollo-server-express");
const { authMiddleware } = require("./utils/auth");

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");

const PORT = process.env.PORT || 3001;
const app = express();
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  //make every request perform an auth check; pass updated req object to resolvers as context
  context: authMiddleware,
});

// integrate our Apollo server with the Express application as middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//in production, if the Node environment is in production, instruct the Express.js server to serve any files in the React application's build directory in the client folder.
// Serve up static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}
//in production, if we make a GET request to any location on the server that doesn't have an explicit route defined, respond with the production-ready React front-end code
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
