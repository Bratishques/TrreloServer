const Board = require("../../models/Board");

const boardDef = `
    type Board {
        _id: ID!
        name: String!
        threads: [Thread!]
        tags: [Tag!]
    }
    `;
const boardResolvers = {
   Query: {
    boards: async () => {
        try {
          const Boards = await Board.find().populate("threads").populate('tags');
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
      async createBoard(_,{name}) {
        try {
          const board = new Board({
            name: name,
            threads: [],
            tags: [],
          });
          await board.save();
          return { ...board.toJSON(), _id: board.id };
        } catch (e) {
          console.log(e);
        }
      },
    }
}
module.exports.boardDef = boardDef
module.exports.boardResolvers = boardResolvers