var { buildSchema } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');
const { boardDef, boardResolvers } = require('./Board/board');
const { commentDef, commentResolvers } = require('./Comment/comment');
const { postDef, postResolvers } = require('./Post/Post');
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

    createTag(name: String!, boardId: ID!): Tag
    createComment(authorId: ID!, text: String!, threadId: ID!): Comment
    replyToComment(commentId: ID!, authorId: ID!, text: String!): Comment
    applyTagToPost(PostId: ID!, tagId: ID!): Thread

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
    createBoard(name: String!): Board
    createThread(name: String!, boardId: ID!): Thread
    createTag(name: String!, boardId: ID!): Tag
    createPost(name: String, threadId: ID!): Post
  }
`;

const executableSchema = makeExecutableSchema({
  typeDefs: [query, boardDef, threadDef, tagDef, postDef, commentDef],
  resolvers: merge(boardResolvers, threadResolvers, tagResolvers, postResolvers, commentResolvers)

})

module.exports = executableSchema