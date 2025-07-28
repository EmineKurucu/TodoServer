const express = require("express");
const router = express.Router();
const {createEntry} = require("../controller/EntryControllers/ceateEntry");
const {deleteEntry} = require("../controller/EntryControllers/deleteEntry");
const {getEntries} = require("../controller/EntryControllers/getEntries");
const {updateEnrty} = require("../controller/EntryControllers/updateEntry");
const {markCompleted} = require("../controller/EntryControllers/markCompleted");
const verifyToken = require("../middleware/authMiddleware");


// ayıt oluşturma ve çekme
router.post("/entries", verifyToken, createEntry);
router.get("/entries", verifyToken, getEntries);


// ID bazlı işlemler (delete, update, markCompleted)
router.delete("/entries/:id", verifyToken, deleteEntry);
router.update("/entries/:id", verifyToken, updateEnrty);
router.patch("/entries/:id/completed", verifyToken, markCompleted);

module.exports = router;