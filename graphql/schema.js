var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    hello: String
    boards: [Board!]
  }
  type Mutation {
    createBoard(name: String!):Board
    createThread(name: String!, boardId: ID!): Thread
    createTag(name: String!, boardId: ID!): Tag
    createComment(authorId: ID!, text: String!): Comment
    replyToComment(commentId: ID!, authorId: ID!, text: String!): Comment
  }
  type Board {
    _id: ID!
    name: String!
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
  schema {
    query: Query
    mutation: Mutation
  }
`);

module.exports = schema