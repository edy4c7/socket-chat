class Message {
  constructor (id, text, createdAt, room) {
    this.id = id
    this.text = text
    this.createdAt = createdAt
    this.room = room
  }
}

module.exports = Message
