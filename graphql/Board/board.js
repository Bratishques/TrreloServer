const { PubSub, withFilter } = require("apollo-server");
const c = require("config");
const { indexOf } = require("lodash");
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
    board: async (_, { boardId: boardId, userId: userId }) => {
      try {
        const user = await User.findById(userId).populate({
          path: "boards",
          populate: {
            path: "threads",
            populate: {
              path: "posts",
            },
          },
        })

       
        await user.save()
        const result = user.boards.find((x) => x.id === boardId);
        return { ...result.toJSON(), _id: result._id };
      } catch (e) {
        console.log(e);
        return { e };
      }
    },
  },
  Mutation: {

    async addUserToBoard(_, {userEmail, boardId}) {
      try {
        const user = await User.findOne({email: userEmail})
        if (!user) {
          throw new Error("User not found")
        }
        console.log(boardId)
        const candidate = user.boards.find(a => a == boardId)

       
        if (candidate) {
          throw new Error("User has such board")
        }
        const board = await Board.findById(boardId)
        
       
        user.boards.push(board)
        await user.save()
        pubsub.publish(BOARD_ADDED, {
          ...board.toJSON(), userId: user.id, _id: board.id
        })
        return {...board.toJSON(), _id:board.id}
      } 
      catch (e) {
        return e
      }
    },
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
          boardAdded: { ...board.toJSON(), userId: user.id, _id: board.id },
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
