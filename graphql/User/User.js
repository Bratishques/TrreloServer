const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userDef = `
    type User {
        _id: ID!
        name: String!
        email: String!
        password: String!
        boards: [Board!]
    }
    type Token {
        token: String!
        userId: ID!
    }
    type Verification {
        valid: Boolean!
    }
`;

const UserResolvers = {

  Query:{
    userBoards: async (_, {userId}) => {
      try {
      const user = await User.findById(userId).populate('boards')
      return user.boards
    }
    catch (e) {
      console.log(e)
    }
    }
  },
  Mutation: {
    createUser: async (_, { name, email, password }) => {
      const candidate = await User.findOne({ email: email.toLowerCase() });
      try {
        if (candidate) {
          throw new Error("Email is already registered");
        }
        const hashPass = await bcrypt.hash(password, 11);
        const user = new User({
          name: name,
          email: email.toLowerCase(),
          password: hashPass,
        });
        await user.save();
        return { ...user.toJSON(), _id: user.id };
      } catch (e) {
        console.log(e);
      }
    },
    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase()});
        
        if (!user) {
          throw new Error("No email/password pair found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("No email/password pair found");
        }
        const token = jwt.sign({ userId: user.id }, "jwtsecret", {
          expiresIn: "12h",
        });
        return { token: token, userId: user.id };
      } catch (e) {
        console.log(e);
        return e
      }
    },
    verifyToken: async (_, { token, userId }) => {
      try {
        const valid = jwt.verify(token, "jwtsecret").userId;
        return { valid: valid === userId };
      } catch (e) {
        return {valid: false}
      }
    },
  },
};

module.exports.userDef = userDef;
module.exports.UserResolvers = UserResolvers;
