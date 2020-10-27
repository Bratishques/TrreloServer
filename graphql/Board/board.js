const Board = require("../../models/Board");

const boardDef = `
    type Board {
        _id: ID!
        name: String!
        threads: [Thread!]
        createdAt: String!
    }
    `;
const boardResolvers = {
   Query: {
    boards: async () => {
        try {
          const Boards = await Board.find().populate("threads", "tags");
          return Boards;
        } catch (e) {
          console.log(e);
        }
      },
      hello: () => {
        return "Hello world!";
      },
    },
      Mutation: {
      createBoard: async ({ name: name }) => {
        try {
          const board = new Board({
            name,
            threads: [],
            tags: [],
          });
          const newBoard = await board.save();
          return { ...newBoard.toJSON(), _id: newBoard.id };
        } catch (e) {
          console.log(e);
        }
      },
    }
}
module.exports.boardDef = boardDef
module.exports.boardResolvers = boardResolvers