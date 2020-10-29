const Board = require("../../models/Board");
const User = require("../../models/User");

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
      async createBoard(_,{name, userId}) {
        try {
          const user = await User.findById(userId)
          const board = new Board({
            name: name,
            threads: [],
            tags: [],
          });
          await board.save();
          user.boards.push(board)
          await user.save()
          return { ...board.toJSON(), _id: board.id };
        } catch (e) {
          console.log(e);
        }
      },
    }
}
module.exports.boardDef = boardDef
module.exports.boardResolvers = boardResolvers