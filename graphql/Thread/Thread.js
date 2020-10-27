const Board = require("../../models/Board");
const Thread = require("../../models/Thread");


const threadDef = `
type Thread {
    _id: ID!
    name: String!
    posts: [Post!]
  },

`;

const threadResolvers = {
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