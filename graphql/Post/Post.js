const { withFilter, PubSub } = require("apollo-server");
const Post = require("../../models/Post");
const Thread = require("../../models/Thread");
const POST_ADDED = "POST_ADDED"

const pubsub = new PubSub()

const postDef = `
    type Post {
        _id: ID!
        name: String!
        status: String!
        comments: [Comment!]
        attachments: [Attachment!]
        createdAt: String!
        updatedAt: String!
        threadId: ID
    }
`;
const postResolvers = {
    Subscription: {
        postAdded: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([POST_ADDED]),
                (payload, variables) => {
                    let result = false
                    variables.threadIds.map(id => {
                        if (payload.postAdded.threadId === id) {
                            result = true
                        }
                    })
                    return result
                }
            )
        }

    },
    Mutation: {
        createPost: async (_, {name: name, threadId: threadId}) => {
            const post = new Post({
                name: name,
                status: "Open",
                comments: [],
                attachments: [],
            })
            const thread = await Thread.findById(threadId) 
            await post.save()
            thread.posts.push(post)

            pubsub.publish(POST_ADDED, {
                postAdded: {...post.toJSON(), _id: post.id, threadId: thread.id }
            })
            await thread.save()
            return {...post.toJSON(), _id: post.id, threadId: thread.id}

        }
    }
}

module.exports.postDef = postDef
module.exports.postResolvers = postResolvers