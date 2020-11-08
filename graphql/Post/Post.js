const { withFilter, PubSub } = require("apollo-server");
const Post = require("../../models/Post");
const Thread = require("../../models/Thread");
const POST_ADDED = "POST_ADDED"
const POST_UPDATED = "POST_UPDATED"

const pubsub = new PubSub()

const postDef = `
    type Post {
        _id: ID!
        name: String!
        status: String!
        comments: [Comment!]
        attachments: [Attachment!]
        description: String
        createdAt: String!
        updatedAt: String!
        threadId: ID
        updateType: String
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
        },
        postUpdated: {
            subscribe: withFilter(
            () => pubsub.asyncIterator([POST_UPDATED]),
            (payload, variables) => {
                if (payload.postUpdated.postId !== variables.postId) {
                    return false
                }
                else return true
            }
        )}

    },

    Query: {
        post: async (_, {postId: postId}) => {
            const post = await Post.findById(postId)
            return {...post.toJSON(), _id: post.id}
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

        },

        updatePostDescription: async (_, {postId: postId, description: description}) => {
            const post = await Post.findById(postId)
            post.description = description
            await post.save()
            pubsub.publish(POST_UPDATED, {
                postUpdated: {...post.toJSON(), postId: postId, _id: postId, updateType: "descriptionUpdated" }
            })
            return {...post.toJSON(), _id: post.id}
        }
    }
}

module.exports.postDef = postDef
module.exports.postResolvers = postResolvers