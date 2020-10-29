const attachmentDef = `
    type Attachment {
        _id: ID!
        name: String!
        type: String!
        link: String!
    }
`

const attachmentResolvers = {
    Mutation: {
        addAttachment: async(_,{name}) => {
            
        }
    }
}

module.exports.attachmentDef = attachmentDef
module.exports.attachmentResolvers = attachmentResolvers