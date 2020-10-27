const { graphqlHTTP } = require('express-graphql');
const express = require("express");
var logger = require('morgan');
const config = require("config")
const mongoose = require("mongoose")
const cors = require("cors")


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const executableSchema = require('./graphql/schema');
const root = require('./graphql/root');

var app = express();

// view engine setup\
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const PORT = process.env.PORT || 5000

app.use("/graphql", graphqlHTTP({
  schema: executableSchema,
  graphiql: true,
}))

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
      app.listen(PORT, () => console.log(`Server started at ${PORT}`))
  } catch (e) {
      console.log("Server error", e.message)
      process.exit(1)
  }
}

start()