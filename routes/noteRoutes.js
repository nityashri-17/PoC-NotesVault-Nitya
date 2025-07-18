import express from "express";
import Note from "../model/noteModel.js";
const router = express.Router();
import protect from "../middleware/auth.js";
import upload, {uploadToS3, deleteFromS3} from "../utils/s3upload.js";

router.post("/", upload.array("files"), async (req, res) => {
  try {
    const { title, content } = req.body;

    const fileURLs = await Promise.all(
      req.files.map(async (file) => {
        const { Location } = await uploadToS3(file);
        return Location;
      })
    );

    const newNote = new Note({
      userId: req.userId,
      title,
      content,
      fileURLs,
    });

    await newNote.save();
    res.json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.get("/",  async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.userId });
        res.json({ notes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// router.get("/:noteId",  async (req, res) => {
//     try {
//         const notes = await Note.find({ userId: req.userId });
//         res.json({ notes });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
router.put("/:noteId", upload.array("files"), async (req, res) => {
  const { noteId } = req.params;
  const { title, content } = req.body;

  try {
    const note = await Note.findOne({ _id: noteId, userId: req.userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    // Delete old files from S3
    await Promise.all(note.fileURLs.map(async (url) => {
      if (url) await deleteFromS3(url);
    }));

    const fileURLs = await Promise.all(
      req.files.map(async (file) => {
        const { Location } = await uploadToS3(file);
        return Location;
      })
    );

    note.title = title || note.title;
    note.content = content || note.content;
    note.fileURLs = fileURLs;

    await note.save();

    res.json({ message: "Note updated successfully", note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:noteId", async (req, res) => {
  const { noteId } = req.params;

  try {
    const note = await Note.findOne({ _id: noteId, userId: req.userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    await Promise.all(note.fileURLs.map(async (url) => {
      if (url) await deleteFromS3(url);
    }));

    await Note.deleteOne({ _id: noteId });

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;