const usersDB = {
  data: [],

  add(userData) {
    this.data.push(userData);
  },

  delete(userName) {
    this.data = this.data.filter(user => user.name !== userName);
  },

  deleteAll() {
    this.data = [];
  },

  find(userName) {
    return this.data.find(user => user.name === userName);
  },

  get() {
    return this.data;
  }
}

module.exports = usersDB;
