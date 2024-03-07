const chatDB =  {
  data: [],

  add(messageData) {
    this.data.push(messageData);
  },

  clear() {
    this.data = [];
  },

  get() {
    return this.data;
  }
}

module.exports = chatDB;
