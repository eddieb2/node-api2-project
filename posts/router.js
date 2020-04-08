const express = require('express');
const router = express.Router();
const Posts = require('../data/db');

// FIXME
// QUESTIONS HERE: >>
// -File Structure?
// -When should i use errorMessage vs message?
// -When I enter an invalid post id my message doesn't show. (GET)
// -For the 3rd GET did is that the appropriate status?
// I don't understand how to console.log here at all.

// NOTE 100% working.
router.get('/', (req, res) => {
  Posts.find(req.query)
    .then((response) => {
      res.status(200).json({ message: req.query, response });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error retrieving the posts.' });
    });
});

// NOTE 100% working
router.get('/:id', (req, res) => {
  Posts.findById(req.params.id)
    .then((response) => {
      if (response.length) {
        res.status(200).json(response);
      } else {
        res.status(404).json({ message: 'Post not found.' });
      }
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: 'Error retreiving the post.' });
    });
});

// NOTE 100% working
router.get('/:id/comments', (req, res) => {
  Posts.findPostComments(req.params.id)
    .then((response) => {
      if (response.length) {
        res.status(200).json(response);
      } else {
        res.status(404).json({ message: 'No comments were found.' });
      }
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: 'Error retreiving the post.' });
    });
});

// NOTE 100% Working
// ANCHOR >> Is it okay that I am returning the req.body to the client? When I had response there it was only returning the ID.
router.post('/', (req, res) => {
  if (req.body.title === '' || req.body.title === undefined) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.',
    });
  } else if (req.body.contents === '' || req.body.contents === undefined) {
    res.status(400).json({
      error: 'There was an error while saving the post to the database',
    });
  } else {
    Posts.insert(req.body)
      .then((response) => {
        res.status(201).json(req.body);
      })
      .catch((err) => {
        res.status(500).json({ errorMessage: 'Error adding the post.' });
      });
  }
});

// NOTE 75% Working
// NEED TO FIGURE OUT HOW TO TELL IF ID
// When the "post_id" is changed the comment gets stored at the appropriate post.
router.post('/:id/comments', (req, res) => {
  // console.log(Number(req.body.post_id));
  // console.log(typeof req.body.post_id);

  // Posts.findById(Number(req.body.post_id))

  if (req.body.text === '' || req.body.text === undefined) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide text for the comment.' });
  } else {
    Posts.insertComment(req.body)
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((err) => {
        res.status(500).json({
          error:
            'There was an error while saving the comment to the database',
        });
      });
  }
});

// NOTE 100% Working.
// Successfully Deletes the item //
// ANCHOR >> This only returns a single number as the response to the client
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  Posts.remove(id)
    .then((response) => {
      if (response) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'The post could not be removed' });
    });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const contents = req.body.contents;
  const changes = req.body;

  console.log(changes);

  Posts.update(id, changes)
    .then((response) => {
      if (response) {
        if (title === '' || title === undefined) {
          res.status(400).json({
            errorMessage:
              'Please provide title and contents for the post.',
          });
        } else if (contents === '' || contents === undefined) {
          res.status(400).json({
            errorMessage:
              'Please provide title and contents for the post.',
          });
        } else {
          res.status(200).json(response);
        }
      } else {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.',
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: 'The post information could not be modified.' });
    });
});

module.exports = router;
