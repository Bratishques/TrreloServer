var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    hello: String
    boards: [Board!]
    threads
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
  type Board {
    _id: ID!
    name: String!
    threads: [Thread!]
    createdAt: String!
  }
  type Thread {
    _id: ID!
    name: String!
    tags: [Tag!]
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