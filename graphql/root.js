

var root = {
    hello: () => {
      return 'Hello world!';
    },
    boards: async () => {
      try {
        const Boards = [{
          title: "First Board",
          color: "Red",
          threads: [],
          createdAt: "20.02.02"
        }]
        return Boards
      }
      catch (e) {
        console.log(e)
      }
    }
  };

module.exports = root