const express = require("express");
const router = express.Router();

const login = require("../controller/User/login");
const register = require("../controller/User/register");
const editAccount = require("../controller/User/editAccount");
const deleteAccount = require("../controller/User/deleteAccount");

const verifyToken = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

router.post("/edit-account", verifyToken, editAccount);
router.post("/delete-account", verifyToken, deleteAccount);

module.exports = router;
