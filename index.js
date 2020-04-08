const express = require("express");
const server = express();
const postsRouter = require("./posts/router");

server.use(express.json());

server.use("/api/posts", postsRouter);

// Endpoints
server.get("/", (req, res) => {
  res.send(`
    <h1> Test </h1>
  `);
});

server.listen(5000, () => {
  console.log("\n*** Server Running on http://localhost:5000 ***\n");
});
