const Board = require("../models/Board");
const Thread = require("../models/Thread");


var root = {
    hello: () => {
      return 'Hello world!';
    },
    boards: async () => {
      try {
        const Boards = await Board.find().populate('threads')
        return Boards
      }
      catch (e) {
        console.log(e)
      }
    },
    createBoard: async ({name : name}) => {
      try {
        const board = new Board({
          name,
          threads: [],
          color: "default",
          tags: []
        })
        const newBoard = await board.save()
        return {...newBoard.toJSON(), _id: newBoard.id}
      }
      catch(e) {
        console.log(e)
      }
    },
    createThread: async({name: name, boardId: boardId}) => {
      const thread = new Thread({
        name: name,
        color: "default",
        status: "Open",
        comments: [],
      })
      await thread.save()
      const board = await Board.findById(boardId)
      board.threads.push(thread)
      await board.save()
      return {...thread.toJSON(), _id: thread.id}
    }
  };

module.exports = root