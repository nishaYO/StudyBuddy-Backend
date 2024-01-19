const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const userResolvers = require("./resolvers/userResolvers.js");
const userTypes = require("./types/userTypes.js");
const cors = require("cors");
const { config } = require("dotenv");

config();

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
const server = new ApolloServer({
  typeDefs: [userTypes],
  resolvers: [userResolvers],
});

async function startServer() {
  await server.start();

  // Middleware to log every request data
  app.use((req, res, next) => {
    console.log(`Request received at ${new Date().toISOString()}`);
    // console.log(`Method: ${req.method}`);
    // console.log(`Path: ${req.path}`);
    // console.log(`Body: ${JSON.stringify(req.body)}`);
    next();
  });

  // Apply the Apollo Server middleware to the "/graphql" path
  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT;

  app.listen(PORT, () => {
    console.log(
      `Server running at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startServer();
