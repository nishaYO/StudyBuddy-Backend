const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const userResolvers = require("./resolvers/userResolvers.js");
const userTypes = require("./types/userTypes.js");
const cors = require('cors');
const { config } = require('dotenv');
config();

const app = express();

// Enable CORS for all routes
app.use(cors());

const server = new ApolloServer({
  typeDefs: [userTypes],
  resolvers: [userResolvers],
});

async function startServer() {
  await server.start();

  // Apply the Apollo Server middleware to the "/graphql" path
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT;

  app.listen(PORT, () => {
    console.log(
      `Server running at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startServer();
