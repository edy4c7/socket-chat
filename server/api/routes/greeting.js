const express = require('express')

const router = express.Router()

router.get('/', (req, res) => res.json({ greeting: 'Hello!' }))

module.exports = router
