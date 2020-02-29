class Room {
  constructor (id, password, createdAt, expireDate) {
    this.id = id
    this.password = password
    this.createdAt = createdAt
    this.expireDate = expireDate
  }
}

module.exports = Room
