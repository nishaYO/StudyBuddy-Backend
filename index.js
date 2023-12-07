const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');

const app = express();
app.use(cors());

const typeDefs = gql`
  type Query {
    placeholder: String
  }

  type User {
    name: String!
    email: String!
  }

  type AuthPayload {
    user: User
    token: String
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): AuthPayload
  }
`;

const resolvers = {
  Query: {
    placeholder: () => "Hello, World!", // Add a placeholder query resolver
  },
  Mutation: {
    signup: (_, { name, email, password }) => {
      // In a real application, you would handle user signup logic here
      // For simplicity, return a dummy response
      const user = {
        name,
        email,
      };

      const token = 'your_jwt_token_here';

      return {
        user,
        token,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Make sure to await server.start() before applying middleware and starting the server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
