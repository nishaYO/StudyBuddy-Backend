const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { config } = require("dotenv");
const cors = require("cors");

const userResolvers = require("./resolvers/userResolvers.js");
const notesResolvers = require("./resolvers/notesResolvers.js");
const sessionResolvers = require("./resolvers/sessionResolvers.js");
const reportsResolvers = require("./resolvers/reportsResolvers.js");
const contactFormResolvers = require("./resolvers/contactFormResolvers.js");
const userTypes = require("./types/userTypes.js");
const notesTypes = require("./types/notesTypes.js");
const sessionTypes = require("./types/sessionTypes.js");
const reportsTypes = require("./types/reportsTypes.js");
const contactFormTypes = require("./types/contactTypes.js");
const mongoose = require('mongoose');

// Load environment variables from .env file
config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1); // Exit the application if unable to connect to MongoDB
});

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.get('/checkr',(req,res)=>{
  console.log(['5','5','5','5'].map(parseInt));
  return res.status(200).json({message:"true"});
})

const mergedTypeDefs = mergeTypeDefs([userTypes, notesTypes, sessionTypes, reportsTypes, contactFormTypes]);
const mergedResolvers = mergeResolvers([userResolvers, notesResolvers, sessionResolvers, reportsResolvers, contactFormResolvers]);

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
});

async function startServer() {
  await server.start();

  // Middleware to log every request data
  app.use((req, res, next) => {
    if (req.body && req.body.query && req.body.query.includes("IntrospectionQuery")) {
      console.log("Introspect query received");
    } else {
      // console.log(`Request received at ${new Date().toISOString()}`);
      // console.log(`Path: ${req.path}`);
      console.log(`Method: ${req.method}`);
      console.log(`Body: ${JSON.stringify(req.body)}`);
    }
    next();
  });

  // Apply the Apollo Server middleware to the "/graphql" path
  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(
      `Server running at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log((['5','5','5','5'].map(parseFloat)).map(parseInt));
  });
}

startServer();
