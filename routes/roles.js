const express = require('express');
const router = express.Router();
const Role = require('../schemas/role');

// GET all
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find();
        res.send(roles);
    } catch (err) {
        res.status(500).send({ success: false, message: err.message });
    }
});

// GET by ID
router.get('/:id', async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        res.send(role);
    } catch (err) {
        res.status(500).send({ success: false, message: err.message });
    }
});

// CREATE
router.post('/', async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.send({ success: true, data: role });
    } catch (err) {
        res.status(400).send({ success: false, message: err.message });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const updated = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send({ success: true, data: updated });
    } catch (err) {
        res.status(400).send({ success: false, message: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Role.findByIdAndDelete(req.params.id);
        res.send({ success: true, data: deleted });
    } catch (err) {
        res.status(500).send({ success: false, message: err.message });
    }
});

module.exports = router;
