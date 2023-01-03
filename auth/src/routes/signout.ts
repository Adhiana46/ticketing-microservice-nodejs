import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
    res.send("GET /api/users/signout");
});

export default router;