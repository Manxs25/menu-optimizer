const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const auth = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/bulk-upload", auth, upload.single("file"), menuController.bulkUpload);

router.get("/", auth, menuController.getMenu);
router.get("/stats", auth, menuController.getStats);
router.get("/analysis", auth, menuController.getMenuAnalysis);
router.post("/add", auth, menuController.addDish);
router.put("/:id", auth, menuController.updateDish);
router.delete("/:id", auth, menuController.deleteDish);
router.post('/optimize', auth, menuController.optimizeMenu);

module.exports = router;
