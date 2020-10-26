const Board = require("../models/Board");
const Tag = require("../models/Tag");
const Thread = require("../models/Thread");
const User = require("../models/User");

var root = {
  hello: () => {
    return "Hello world!";
  },
  boards: async () => {
    try {
      const Boards = await Board.find().populate("threads", "tags");
      return Boards;
    } catch (e) {
      console.log(e);
    }
  },
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
  createThread: async ({ name: name, boardId: boardId }) => {
    const thread = new Thread({
      name: name,
      color: "default",
      status: "Open",
    });
    await thread.save();
    const board = await Board.findById(boardId);
    board.threads.push(thread);
    await board.save();
    return { ...thread.toJSON(), _id: thread.id };
  },
  createTag: async ({ name: name, boardId: boardId }) => {
    try {
      const tag = new Tag({
        name: name,
        color: "default",
      });
      await tag.save();
      const board = await Board.findById(boardId);
      board.tags.push(tag);
      await board.save();
      return { ...tag.toJSON(), _id: tag.id };
    } catch (e) {
      console.log(e);
    }
  },
  createComment: async ({
    authorId: authorId,
    text: text,
    postId: postId,
  }) => {
    try {
      const author = await User.findById(authorId)
      const comment = new Comment({
        text: text,
        replies: [],
        author: author
      });
      await comment.save()
      const post = await Thread.findById(postId)
      post.comments.push(comment)
      await thread.save()
      return {...comment.toJSON, _id: comment.id}
    } catch (e) {
      console.log(e)
    }
  },
  replyToComment: async ({
    commentId: commentId,
    authorId: authorId,
    text: text,
  }) => {
    try {
      const author = await User.findById(authorId)
      const reply = new Comment({
        text: text,
        replies: [],
        author: author
      });
      await reply.save()
      const comment = await Comment.findById(commentId)
      comment.replies.push(reply)
      return {...reply.toJSON(), _id: reply.id}
    }
    catch (e) {
      console.log(e)
    }
  },
  applyTagToThread: async ({}) => {
    try {
    
    }
    catch (e) {
      console.log(e)
    }
  }
};

module.exports = root;
