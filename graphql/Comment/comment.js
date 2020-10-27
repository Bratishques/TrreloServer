const commentDef = `
    type Comment {
        _id: ID!
        author: [User!]
        text: String!
        replies: [Comment!]
    }
`;

const commentResolvers = {
    Mutation: {
        createComment: async (_,{
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
          replyToComment: async (_,{
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
    }
}

module.exports.commentDef = commentDef
module.exports.commentResolvers = commentResolvers