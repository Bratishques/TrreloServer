const Tag = require("../../models/Tag");


const tagDef = `
type Tag {
    _id: ID!
    name: String!
    color: String!
  },
`;

const tagResolvers = {
    Mutation : {
    createTag: async (_, { name: name, boardId: boardId }) => {
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
    }
}

module.exports.tagDef = tagDef
module.exports.tagResolvers = tagResolvers