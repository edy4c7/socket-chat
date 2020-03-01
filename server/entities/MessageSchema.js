const { EntitySchema } = require('typeorm')
const Message = require('../models/Message')

module.exports = new EntitySchema({
  name: 'Message',
  target: Message,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    text: {
      type: 'text'
    },
    createdAt: {
      type: 'datetime',
      createDate: true
    }
  },
  relations: {
    room: {
      target: 'Room',
      type: 'many-to-one',
      joinColumn: {
        name: 'room'
      }
    }
  }
})
