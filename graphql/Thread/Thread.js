const { PubSub, withFilter } = require("apollo-server");
const Board = require("../../models/Board");
const Thread = require("../../models/Thread");
const THREAD_ADDED = "THREAD_ADDED"
const THREAD_DELETED = "THREAD_DELETED"

const pubsub = new PubSub()


const threadDef = `
type Thread {
    _id: ID!
    name: String!
    posts: [Post!]
  },

`;

const threadResolvers = {

  Query: {
    thread: async(_, {threadId: threadId}) => {
      try{
        const thread = await Thread.findById(threadId).populate("posts")
        return {...thread.toJSON(), _id: threadId }
      }
      catch (e){
        return e
      }
    }
  },
  Subscription: {
    threadDeleted: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([THREAD_DELETED]),
        (payload,variables) => {
          return payload.threadDeleted.boardId === variables.boardId
        }
      )
    },
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
      deleteThread: async(_, {threadId: threadId, boardId: boardId}) => {
          try {
            await Thread.deleteOne({_id:threadId})
            pubsub.publish(THREAD_DELETED, {
              threadDeleted : {_id: threadId, boardId: boardId}
            })
            return {_id: threadId}
          }
          catch (e) {

          }
      }
    }
}

module.exports.threadDef = threadDef
module.exports.threadResolvers = threadResolvers