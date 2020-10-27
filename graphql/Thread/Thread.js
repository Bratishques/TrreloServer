const Thread = require("../../models/Thread");


const threadDef = `
type Thread {
    _id: ID!
    name: String!
  },

`;

const threadResolvers = {
    Mutation: {
    createThread: async ({ name: name, boardId: boardId }) => {
        const thread = new Thread({
          name: name,
          color: "default",
        });
        await thread.save();
        const board = await Board.findById(boardId);
        board.threads.push(thread);
        await board.save();
        return { ...thread.toJSON(), _id: thread.id };
      },
    }
}

module.exports.threadDef = threadDef
module.exports.threadResolvers = threadResolvers