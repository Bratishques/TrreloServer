const { ApolloServer, gql, makeExecutableSchema } = require("apollo-server-express");
const express = require("express");
var logger = require("morgan");
const config = require("config");
const mongoose = require("mongoose");
const cors = require("cors");
const { execute, subscribe } = require('graphql') ;
const executableSchema = require("./graphql/schema");
const { SubscriptionServer } = require("subscriptions-transport-ws");

var app = express();

// Important!!!

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

/*app.use("/graphql", graphqlHTTP({
  schema: executableSchema,
  graphiql: true,
}))*/

const server = new ApolloServer({
  resolvers: executableSchema.resolvers,
  typeDefs: executableSchema.typeDefs,
});




server.applyMiddleware({ app });



app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
});

const start = async () => {
  try {
    await mongoose.connect(config.get("mongoUri"), {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
  } catch (e) {
    console.log("Server error", e.message);
    process.exit(1);
  }
};

start();

SubscriptionServer.create({
  schema: makeExecutableSchema(executableSchema),
  execute,
  subscribe,
  onConnect: () => {
    console.log("someone connected")
  },
  onDisconnect: () => {
    console.log("someone disconnected")
  }
},
{
  server: app.listen(PORT, () => console.log( `🚀 Server ready at http://localhost:5000${server.graphqlPath}`)),
  path: `/graphql`
}
)



