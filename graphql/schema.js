var { buildSchema } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');
const { PubSub, gql } = require('apollo-server');
const { attachmentDef, attachmentResolvers } = require('./Attachment/attachment');
const { boardDef, boardResolvers } = require('./Board/board');
const { commentDef, commentResolvers } = require('./Comment/comment');
const { postDef, postResolvers } = require('./Post/Post');
const { tagDef, tagResolvers } = require('./Tag/Tag');
const { threadDef, threadResolvers } = require('./Thread/Thread');
const { userDef, UserResolvers } = require('./User/User');


const pubsub = new PubSub(); 

const query = gql`
  type Query {
    hello: String!
    boards: [Board!]
    userBoards(userId: ID!): [Board!]
    board(userId: ID!, boardId: ID!): Board!
    post(postId: ID!): Post!
    thread(threadId: ID!) : Thread!
  }
  type Subscription {
    boardAdded(userId: ID!): Board
    threadAdded(boardId: ID!): Thread
    postAdded(threadId: ID!): Post
    postUpdated(postId: ID!): Post
    postDeleted(threadId: ID!): Post
    threadDeleted(boardId: ID!): Thread
  }
  type Mutation {
    createBoard(name: String!, userId: ID!): Board
    createThread(name: String!, boardId: ID!): Thread
    createTag(name: String!, boardId: ID!): Tag
    applyTagToThread(name: String!, threadId: ID!): Tag
    createPost(name: String!, threadId: ID!): Post
    createUser(name: String!, email: String!, password:String!): User
    login(email: String!, password: String!): Token
    verifyToken(token: String!, userId: ID!): Verification
    addAttachment(name: String!): Attachment
    createComment(authorId: ID!, text: String!, postId: ID!): Comment
    replyToComment(authorId: ID!, text: String!, commentId: ID!): Comment
    addUserToBoard(userEmail: String!, boardId: ID!): User
    updatePostDescription(postId: ID!, description: String!): Post
    updatePostName(postId: ID!, name: String!):Post
    deletePost(postId: ID!, threadId: ID!): Post
    deleteThread(threadId: ID!, boardId: ID!): Post
  }
`;

const executableSchema = {
  typeDefs: [query, boardDef, threadDef, tagDef, postDef, commentDef, userDef, attachmentDef],
  resolvers: merge(boardResolvers, threadResolvers, tagResolvers, postResolvers, commentResolvers, attachmentResolvers, UserResolvers)

}

module.exports = executableSchema