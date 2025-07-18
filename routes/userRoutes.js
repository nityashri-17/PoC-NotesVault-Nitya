import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import generateToken from "../utils/generateToken.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    console.log(name);
    
    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    

    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    
    return res.json({ token: generateToken(user._id), userId: user._id });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ token: generateToken(user._id), userId: user._id });
});

router.get("/list", async (req, res) => {
    try {
        const users = await User.find({}, "name email password"); 
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/delete/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;