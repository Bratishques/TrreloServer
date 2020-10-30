const { PubSub, withFilter } = require("apollo-server");
const Board = require("../../models/Board");
const User = require("../../models/User");
const BOARD_ADDED = "BOARD_ADDED";

const pubsub = new PubSub();

const boardDef = `
    type Board {
        _id: ID!
        name: String!
        threads: [Thread!]
        tags: [Tag!]
    }
    `;

const boardResolvers = {
  Subscription: {
    boardAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([BOARD_ADDED]),
        (payload, variables) => {
          return payload.boardAdded.userId === variables.userId;
        }
      ),
    },
  },
  Query: {
    boards: async () => {
      try {
        const Boards = await Board.find().populate("threads").populate("tags");
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
    async createBoard(_, { name, userId }) {
      try {
        const user = await User.findById(userId);
        const board = new Board({
          name: name,
          threads: [],
          tags: [],
        });
        await board.save();
        user.boards.push(board);
        await user.save();
        pubsub.publish(BOARD_ADDED, {
          boardAdded: { ...board.toJSON(), userId: user.id, _id: board.id},
        });
        return { ...board.toJSON(), _id: board.id };
      } catch (e) {
        console.log(e);
      }
    },
  },
};
module.exports.boardDef = boardDef;
module.exports.boardResolvers = boardResolvers;
