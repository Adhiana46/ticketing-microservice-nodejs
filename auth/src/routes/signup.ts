import express from "express";

const router = express.Router();

router.post("/api/users/signup", (req, res) => {
    res.send("GET /api/users/signup");
});

export default router;