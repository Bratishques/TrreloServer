const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const userDef = `
    type User {
        name: String!
        email: String!
        password: String!
        boards: [Board!]
    }
`;

const UserResolvers = {
    Mutations: {
        createUser: async (_,{name, email, password}) => {
             const candidate = User.findOne({email: email})
             try {
             if (candidate) {
                 throw new Error("Email is already registered")
             }
             const hashPass = await bcrypt.hash(password, 11)
             const user = new User({
                 name: name,
                 email: email,
                 password: hashPass
             });
             await user.save()
             return {_id: user.id}
            }
            catch (e) {
                console.log(e)
            }
        },
        login: async (_,{email, password}) => {
            try {
            const user = await User.findOne({email: email})
            const isMatch = await bcrypt.compare(password, user.password)
            if (!user || !isMatch) {
                throw new Error("No email/password pair found")
            }
            const token = jwt.sign(
                {userId: user.id},
                "jwtsecret",
                {expiresIn: "12h"}
            )
            return {token}
            }
            catch (e) {
                console.log(e)
            }


        }
    }
}