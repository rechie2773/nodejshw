const express = require('express');
const router = express.Router();
const User = require('../schemas/user');
const Role = require('../schemas/role');

// GET all with filter
router.get('/', async (req, res) => {
    try {
        const { username, fullName, loginCountGte, loginCountLte } = req.query;
        let filter = { isDeleted: false };

        if (username) {
            filter.username = { $regex: username, $options: 'i' };
        }
        if (fullName) {
            filter.fullName = { $regex: fullName, $options: 'i' };
        }
        if (loginCountGte || loginCountLte) {
            filter.loginCount = {};
            if (loginCountGte) filter.loginCount.$gte = parseInt(loginCountGte);
            if (loginCountLte) filter.loginCount.$lte = parseInt(loginCountLte);
        }

        let users = await User.find(filter).populate('role');
        res.send(users);
    } catch (err) {
        res.status(500).send({ success: false, message: err.message });
    }
});

// GET by ID
router.get('/:id', async (req, res) => {
    try {
        let user = await User.findById(req.params.id).populate('role');
        if (!user || user.isDeleted) {
            return res.status(404).send({ success: false, message: "User not found" });
        }
        res.send(user);
    } catch (err) {
        res.status(500).send({ success: false, message: err.message });
    }
});

// CREATE
router.post('/', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.send({ success: true, data: newUser });
    } catch (err) {
        res.status(400).send({ success: false, message: err.message });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send({ success: true, data: updated });
    } catch (err) {
        res.status(400).send({ success: false, message: err.message });
    }
});

// DELETE mềm
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        res.send({ success: true, data: deleted });
    } catch (err) {
        res.status(500).send({ success: false, message: err.message });
    }
});
// email + username verification
router.post('/verify', async (req, res) => {
  try {
      const { username, email } = req.body;

      if (!username || !email) {
          return res.status(400).send({
              success: false,
              message: "Please provide username and email"
          });
      }

      const user = await User.findOne({ username, email, isDeleted: false });

      if (!user) {
          return res.status(404).send({
              success: false,
              message: "Cannot find user with provided username and email"
          });
      }

      user.status = true;
      await user.save();

      res.send({
          success: true,
          message: "User verified successfully",
          data: user
      });

  } catch (err) {
      res.status(500).send({
          success: false,
          message: err.message
      });
  }
});

module.exports = router;
