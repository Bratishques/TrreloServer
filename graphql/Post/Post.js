const Post = require("../../models/Post");
const Thread = require("../../models/Thread");

const postDef = `
    type Post {
        _id: ID!
        name: String!
        status: String!
        comments: [Comment!]
        attachments: [Attachment!]
        createdAt: String!
        updatedAt: String!
    }
`;
const postResolvers = {
    Mutation: {
        createPost: async (_, {name: name, threadId: threadId}) => {
            const post = new Post({
                name: name,
                status: "Open",
                comments: [],
                attachments: [],
            })
            const thread = Thread.findById(threadId) 
            await post.save()
            thread.posts.push(post)
            await thread.save()
            return {...post.toJSON(), _id: post.id, createdAt: post.createdAt, updatedAt: post.updatedAt}

        }
    }
}

module.exports.postDef = postDef
module.exports.postResolvers = postResolvers