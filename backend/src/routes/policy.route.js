const multer = require('multer');
const express = require('express');

const policyController = require('../controllers/policy.controller');
const authMiddleware = require('../middlewares/auth.middlewares');

const router = express.Router();

// memory storage - we parse the PDF immediately, no need to persist the raw file
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB cap
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed'));
        }
        cb(null, true);
    }
});

router.post('/upload', authMiddleware.protect, upload.single('pdfFile'), policyController.uploadPolicy);
router.get('/list', authMiddleware.protect, policyController.listPolicies);
router.patch('/:id/toggle', authMiddleware.protect, policyController.togglePolicy);
router.delete('/:id', authMiddleware.protect, policyController.deletePolicy);

module.exports = router;