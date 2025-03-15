import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 4000;

// In-Memory data store
let posts = [
    {
        id: 1,
        title: "My First Trip to Dubai",
        content: "It was a beautiful morning when I was informed about the trip to Dubai. I was excited for it was my first trip to the Middle East and to Dubai.",
        author: "Mac Anthony",
        date: "2025-01-14T10:00:00Z",
    },
    {
        id: 2,
        title: "My First Trip to The Airport",
        content: "It was an exciting experience going to the airport for the first time on this very day. I had butterflies in my belly throughout the whole trip.",
        author: "Mac Anthony",
        date: "2025-02-14T14:30:00Z",
    },
    {
        id: 3,
        title: "Baby's First Day Out",
        content: "It was a beautiful day, and I decided to take the baby out for the first time to the zoo. Baby was excited as we walked across the street by the sidewalk, with all the vehicles passing by.",
        author: "Mac Anthony",
        date: "2025-03-14T10:30:00Z",
    },
];

let lastId = 3;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ==========================
   ROUTES 
========================== */

// GET ALL posts
app.get("/posts", (req, res) => {
    res.json(posts);
});

// GET a specific post by ID
app.get("/posts/:id", (req, res) => {
    const id = parseInt(req.params.id);

    // Validate the ID
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
    }

    // Find the post
    const foundPost = posts.find((post) => post.id === id);

    // Handle case where post is not found
    if (!foundPost) {
        return res.status(404).json({ message: "Post not found" });
    }

    res.json(foundPost);
});

// POST a new post
app.post("/posts", (req, res) => {
    const newId = ++lastId;
    const postText = {
        id: newId,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        date: new Date().toISOString(),
    };

    posts.push(postText);
    res.status(201).json(postText);
});

// PATCH (update) a post
app.patch("/posts/:id", (req, res) => {
    const id = parseInt(req.params.id);

    // Validate ID
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
    }

    // Find the index of the post
    const searchIndex = posts.findIndex((post) => post.id === id);

    // Handle case where post is not found
    if (searchIndex === -1) {
        return res.status(404).json({ message: "Post not found" });
    }

    // Update only the provided fields
    posts[searchIndex] = {
        ...posts[searchIndex], // Keep existing data
        title: req.body.title || posts[searchIndex].title,
        content: req.body.content || posts[searchIndex].content,
        author: req.body.author || posts[searchIndex].author,
        date: new Date().toISOString(),
    };

    console.log("Updated Post:", posts[searchIndex]);
    res.json(posts[searchIndex]);
});

// DELETE a post
app.delete("/posts/:id", (req, res) => {
    const id = parseInt(req.params.id);

    // Validate ID
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
    }

    // Find the index of the post
    const searchIndex = posts.findIndex((post) => post.id === id);

    // Handle case where post is not found
    if (searchIndex === -1) {
        return res.status(404).json({ message: "Post not found" });
    }

    // Remove the post from the array
    const [deletedPost] = posts.splice(searchIndex, 1);

    console.log("Deleted Post:", deletedPost);
    res.json({ message: "Post deleted successfully", deletedPost });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
