import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import connectDb from './config/db.js';
import noteRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import upload, {uploadToS3} from "./utils/s3upload.js";
import protect from "./middleware/auth.js";

const app = express();

app.use(express.json());
app.use(cors());

const port = 5000

app.get("/", (req, res) => {
    res.send("NotesVault Backend is working!");
});

app.listen(port, async ()=> {
    await connectDb()
    console.log("server started on port 5000")
})

app.use("/api/notes",protect, noteRoutes);
app.use("/api/users", userRoutes);

