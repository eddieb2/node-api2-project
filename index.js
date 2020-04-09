const express = require('express');
const server = express();
const postsRouter = require('./posts/router');

server.use(express.json());

server.use('/api/posts', postsRouter);

// Endpoints
server.get('/', (req, res) => {
  res.send(`
    <h1> Test </h1>
  `);
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});
