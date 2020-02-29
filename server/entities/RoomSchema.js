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
      type: 'varchar'
    },
    createdAt: {
      type: 'datetime'
    },
    expireDate: {
      type: 'datetime'
    }
  }
})
