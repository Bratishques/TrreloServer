const { withFilter, PubSub } = require("apollo-server");
const Post = require("../../models/Post");
const Thread = require("../../models/Thread");
const POST_ADDED = "POST_ADDED";
const POST_UPDATED = "POST_UPDATED";
const POST_DELETED = "POST_DELETED";

const pubsub = new PubSub();

const postDef = `
    type Post {
        _id: ID!
        name: String!
        status: String!
        comments: [Comment!]
        attachments: [Attachment!]
        description: String
        createdAt: String!
        updatedAt: String!
        threadId: ID
        updateType: String
    }
`;
const postResolvers = {
  Subscription: {
    postAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([POST_ADDED]),
        (payload, variables) => {
          console.log(variables.threadId);
          return payload.postAdded.threadId === variables.threadId;
        }
      ),
    },
    postUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([POST_UPDATED]),
        (payload, variables) => {
          if (payload.postUpdated.postId !== variables.postId) {
            return false;
          } else return true;
        }
      ),
    },
    postDeleted: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([POST_DELETED]),
        (payload, variables) => {
          return payload.postDeleted.threadId === variables.threadId;
        }
      ),
    },
  },

  Query: {
    post: async (_, { postId: postId }) => {
      const post = await Post.findById(postId);
      return { ...post.toJSON(), _id: post.id };
    },
  },
  Mutation: {
    deletePost: async (_, { postId: postId, threadId: threadId }) => {
      try {
        await Post.deleteOne({ _id: postId });
        pubsub.publish(POST_DELETED, {
          postDeleted: { _id: postId, postId: postId, threadId: threadId },
        });
        return { _id: postId };
      } catch (e) {
        return e;
      }
    },
    createPost: async (_, { name: name, threadId: threadId }) => {
      const post = new Post({
        name: name,
        status: "Open",
        comments: [],
        attachments: [],
      });
      const thread = await Thread.findById(threadId);
      await post.save();
      thread.posts.push(post);

      pubsub.publish(POST_ADDED, {
        postAdded: { ...post.toJSON(), _id: post.id, threadId: thread.id },
      });
      await thread.save();
      return { ...post.toJSON(), _id: post.id, threadId: thread.id };
    },

    updatePostDescription: async (
      _,
      { postId: postId, description: description }
    ) => {
      const post = await Post.findById(postId);
      post.description = description;
      await post.save();
      pubsub.publish(POST_UPDATED, {
        postUpdated: {
          ...post.toJSON(),
          postId: postId,
          _id: postId,
          updateType: "descriptionUpdated",
        },
      });
      return { ...post.toJSON(), _id: post.id };
    },
    updatePostName: async (_, { postId: postId, name: name }) => {
      const post = await Post.findById(postId);
      post.name = name;
      await post.save();
      pubsub.publish(POST_UPDATED, {
        postUpdated: {
          ...post.toJSON(),
          postId: postId,
          _id: postId,
          updateType: "nameUpdated",
        },
      });
      return { ...post.toJSON(), _id: post.id };
    },
  },
};

module.exports.postDef = postDef;
module.exports.postResolvers = postResolvers;
