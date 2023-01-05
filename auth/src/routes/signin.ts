import express from "express";

const router = express.Router();

router.post("/api/users/signin", (req, res) => {
  res.send("GET /api/users/signin");
});

export default router;
