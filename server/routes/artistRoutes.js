const router = require('express').Router();
let Artist = require('../models/Artist.js');

// Route 1: Saare artists get karna (GET /api/artists)
router.get('/', (req, res) => {
    Artist.find()
        .then(artists => res.json(artists))
        .catch(err => res.status(400).json('Error: ' + err));
});

// NAYA ROUTE: Ek artist ko uski ID se get karna (GET /api/artists/:id)
router.get('/:id', (req, res) => {
    Artist.findById(req.params.id) // ID ko URL se leta hai
        .then(artist => res.json(artist))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;