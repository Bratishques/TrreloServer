var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    hello: String
    boards: [Board!]
  }
  type Board {
    _id: ID!
    title: String!
    color: String!
    threads: [Thread!]
    createdAt: String!
  }
  type Thread {
    _id: ID!
    name: String!
    tags: [Tag!]
    status: String!
    comments: [Comment!]
    createdAt: String!
  },
  type Comment {
    _id: ID!
    author: [User!]
    text: String!
    replies: [Comment!]
    createdAt: String!
  },
  type Tag {
    _id: ID!
    name: String!
    color: String!
    createdAt: String!
  },
  type User {
    name: String!
    email: String!
    password: String!
    boards: [Board!]
  },
`);

module.exports = schema