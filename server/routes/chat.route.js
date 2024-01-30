const express = require('express')

const { createChat, getUserChat, findChat } = require('../controllers/chat.controller');
const router = express.Router();

router.post("/", createChat);
router.get("/:userId", getUserChat);
router.get("/find/:firstId/:secondId",findChat);

module.exports = router;