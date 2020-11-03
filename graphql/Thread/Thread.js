const { PubSub, withFilter } = require("apollo-server");
const Board = require("../../models/Board");
const Thread = require("../../models/Thread");
const THREAD_ADDED = "THREAD_ADDED"

const pubsub = new PubSub()


const threadDef = `
type Thread {
    _id: ID!
    name: String!
    posts: [Post!]
  },

`;

const threadResolvers = {
  Subscription: {
    threadAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([THREAD_ADDED]),
        (payload, variables) => {
          return payload.threadAdded.boardId === variables.boardId
        }
      )
    }
  },
    
    Mutation: {
    createThread: async (_, { name: name, boardId: boardId }) => {
        try {
        const thread = new Thread({
          name: name,
        });
        await thread.save();
        const board = await Board.findById(boardId);
        board.threads.push(thread);

        await board.save();
        pubsub.publish(THREAD_ADDED, {
          threadAdded: {...thread.toJSON(), _id: thread.id, boardId: boardId}
        })
        return { ...thread.toJSON(), _id: thread.id };
    }
    catch (e) {
        console.log(e)
    }
      },
    }
}

module.exports.threadDef = threadDef
module.exports.threadResolvers = threadResolvers