var { buildSchema } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');
const { boardDef, boardResolvers } = require('./Board/board');
const { tagDef, tagResolvers } = require('./Tag/Tag');
const { threadDef, threadResolvers } = require('./Thread/Thread');

/*var schema = buildSchema(`
  type Query {
    hello: String
    boards: [Board!]
  }
  type Mutation {
    createBoard(name: String!):Board
    createThread(name: String!, boardId: ID!): Thread
    createPost(name: String, BoardId: ID!): Post
    createTag(name: String!, boardId: ID!): Tag
    createComment(authorId: ID!, text: String!, threadId: ID!): Comment
    replyToComment(commentId: ID!, authorId: ID!, text: String!): Comment
    applyTagToPost(PostId: ID!, tagId: ID!): Thread

  }
  type Post {
    _id: ID!
    name: String!
    status: String!
    comments: [Comment!]
    attachments: [Attachment!]
  }
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
`);*/

const query = `
  type Query {
    hello: String
    boards: [Board!]
  }
  type Mutation {
    createBoard(name: String!):Board
    createThread(name: String!, boardId: ID!): Thread
    createTag(name: String!, boardId: ID!): Tag
  }
`;

const executableSchema = makeExecutableSchema({
  typeDefs: [query, boardDef, threadDef, tagDef],
  resolvers: merge(boardResolvers, threadResolvers, tagResolvers)

})

module.exports = executableSchema