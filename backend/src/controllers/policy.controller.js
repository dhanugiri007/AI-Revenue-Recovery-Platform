const pdfParse = require('pdf-parse');
const { v4: uuidv4 } = require('uuid');

const policyModel = require('../models/policy.model');
const { chunkText } = require('../utils/chunkText');
const { getEmbeddings } = require('../services/embedding.service');
const { getCollection } = require('../config/vectorDB');

// POST /api/policy/upload  (multipart/form-data, field name: "pdfFile")
async function uploadPolicy(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No PDF file uploaded" });
        }

        const parsed = await pdfParse(req.file.buffer);
        const rawText = parsed.text;

        if (!rawText || rawText.trim().length === 0) {
            return res.status(400).json({ message: "Could not extract text from this PDF" });
        }

        const chunks = chunkText(rawText, 300, 50);
        if (chunks.length === 0) {
            return res.status(400).json({ message: "PDF produced no usable chunks" });
        }

        // 1. Save policy metadata in Mongo first to get an _id
        const policy = await policyModel.create({
            filename: req.file.originalname,
            userId: req.user.id,
            chunkCount: chunks.length,
            active: true
        });

        // 2. Embed all chunks
        const embeddings = await getEmbeddings(chunks);

        // 3. Store in Chroma with policyId in metadata (used for filtering at retrieval time)
        const ids = chunks.map(() => uuidv4());
        const metadatas = chunks.map((_, i) => ({
            policyId: policy._id.toString(),
            filename: req.file.originalname,
            chunkIndex: i
        }));

        const collection = await getCollection();
        await collection.add({
            ids,
            embeddings,
            documents: chunks,
            metadatas
        });

        return res.status(201).json({
            message: "Policy uploaded and indexed successfully",
            policy
        });

    } catch (error) {
        console.log("Policy upload error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function listPolicies(req, res) {
    try {
        const policies = await policyModel.find({ userId: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json({ policies });
    } catch (error) {
        console.log("List policies error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function togglePolicy(req, res) {
    try {
        const { id } = req.params;
        const policy = await policyModel.findOne({ _id: id, userId: req.user.id });
        if (!policy) return res.status(404).json({ message: "Policy not found" });

        policy.active = !policy.active;
        await policy.save();
        return res.status(200).json({ message: "Policy status updated", policy });
    } catch (error) {
        console.log("Toggle policy error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function deletePolicy(req, res) {
    try {
        const { id } = req.params;
        const policy = await policyModel.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!policy) return res.status(404).json({ message: "Policy not found" });

        const collection = await getCollection();
        await collection.delete({ where: { policyId: id } });

        return res.status(200).json({ message: "Policy deleted", id });
    } catch (error) {
        console.log("Delete policy error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { uploadPolicy, listPolicies, togglePolicy, deletePolicy };