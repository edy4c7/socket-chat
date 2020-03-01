const { EntitySchema } = require('typeorm')
const Room = require('../models/Room')

module.exports = new EntitySchema({
  name: 'Room',
  target: Room,
  columns: {
    id: {
      primary: true,
      type: 'varchar'
    },
    password: {
      select: false,
      type: 'varchar'
    },
    createdAt: {
      type: 'datetime',
      createDate: true
    },
    expireDate: {
      type: 'datetime'
    }
  },
  relations: {
    messages: {
      target: 'Message',
      type: 'one-to-many',
      joinColumn: true,
      inverseSide: 'room'
    }
  }
})
