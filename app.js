const { ApolloServer, gql } = require('apollo-server-express')
const express = require("express");
var logger = require('morgan');
const config = require("config")
const mongoose = require("mongoose")
const cors = require("cors")
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const executableSchema = require('./graphql/schema');

var app = express();

// view engine setup\
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const PORT = process.env.PORT || 5000

/*app.use("/graphql", graphqlHTTP({
  schema: executableSchema,
  graphiql: true,
}))*/

const server = new ApolloServer({
  typeDefs: executableSchema.typeDefs,
  resolvers: executableSchema.resolvers
});

server.applyMiddleware({ app })

app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
});


async function start() {
  try {
      await  mongoose.connect(config.get('mongoUri'),{
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useCreateIndex: true
      })
      app.listen(PORT, () => console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`))
  } catch (e) {
      console.log("Server error", e.message)
      process.exit(1)
  }
}

start()