// Using express.js
const express = require('express')
const index = express()

// Using a parser to handle the body from POST method
const bodyParser = require('body-parser')
const Block = require('./block')
const Blockchain = require('./blockchain')
const chain = new Blockchain()

// index.js is configured with web service running on the localhost with port 8000
index.listen(8000, () => console.log('listening port: 8000'))
index.use(bodyParser.json())

index.get('/', (req, res) => res.status(404).json({ //could not be show in terminal
  "status": 404,
  "message": "Accepted endpoints: POST /block or GET /block/{BLOCK_HEIGHT}" 
}))

// GET Block endpoint using URL path with block height parameter. Preferred URL path http://localhost:8000/block/{BLOCK_HEIGHT}
index.get('/block/:height', async (req, res) => {
  try {
    const response = await chain.getBlock(req.params.height)
    res.send(response)
  } catch (error) {
    res.status(404).json({ //could not be show in terminal
      "status": 404,
      "message": "This block is not found." 
    })
  }
})

// POST Block endpoint using key/value pair within request body. Preferred URL path http://localhost:8000/block
//   POST URL path: http://localhost:8000/block
//   Content-Type: indexlication/json
//   Request body: {"body":"block body contents"}
index.post('/block', async (req, res) => {
  if (req.body.body === '' || req.body.body === undefined) {
    res.status(400).json({ //could not be show in terminal
      "status": 400,
      message: "Please fill the body parameter to create a new block"
    })
  }
  await chain.addBlock(new Block(req.body.body))
  const height = await chain.getBlockHeight()
  const response = await chain.getBlock(height)
  res.send(response)
})