import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;

// In-Memory Data Store
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

// Set EJS as View Engine
app.set("view engine", "ejs");

app.use(express.static("public"));

/* ==========================
   API ROUTES (Backend)
========================== */

// GET ALL posts (API)
app.get("/api/posts", (req, res) => {
    res.json(posts);
});

// GET a specific post by ID (API)
app.get("/api/posts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
    }
    const foundPost = posts.find((post) => post.id === id);
    if (!foundPost) {
        return res.status(404).json({ message: "Post not found" });
    }
    res.json(foundPost);
});

// POST a new post (API)
app.post("/api/posts", (req, res) => {
    lastId++;
    const newPost = {
        id: lastId,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        date: new Date().toISOString(),
    };

    posts.push(newPost);
    res.status(201).json(newPost);
});

// PATCH (update) a post (API)
app.patch("/api/posts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
    }
    const searchIndex = posts.findIndex((post) => post.id === id);
    if (searchIndex === -1) {
        return res.status(404).json({ message: "Post not found" });
    }

    posts[searchIndex] = {
        ...posts[searchIndex],
        title: req.body.title || posts[searchIndex].title,
        content: req.body.content || posts[searchIndex].content,
        author: req.body.author || posts[searchIndex].author,
        date: new Date().toISOString(),
    };

    res.json(posts[searchIndex]);
});

// DELETE a post (API)
app.delete("/api/posts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
    }
    const searchIndex = posts.findIndex((post) => post.id === id);
    if (searchIndex === -1) {
        return res.status(404).json({ message: "Post not found" });
    }

    const [deletedPost] = posts.splice(searchIndex, 1);
    res.json({ message: "Post deleted successfully", deletedPost });
});

/* ==========================
   VIEW ROUTES (Frontend)
========================== */

// Render Home Page with Posts
app.get("/", (req, res) => {
    res.render("index", { posts });
});

// Render Create New Post Page
app.get("/new", (req, res) => {
    res.render("modify", { heading: "New Post", submit: "Create Post" });
});

// Render Edit Post Page
app.get("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const foundPost = posts.find((post) => post.id === id);
    if (!foundPost) {
        return res.status(404).json({ message: "Post not found" });
    }
    res.render("modify", {
        heading: "Edit Post",
        submit: "Update Post",
        post: foundPost,
    });
});

// Handle Create New Post (Form Submission)
app.post("/api/posts", async (req, res) => {
    try {
        console.log("Received data from frontend:", req.body);

        const response = await axios.post(`http://localhost:${PORT}/api/posts`, req.body);

        console.log("Backend Response:", response.data);

        res.json({ success: true, post: response.data });
    } catch (error) {
        console.error("Error creating post:", error.message);
        res.status(500).json({ message: "Error creating post", error: error.message });
    }
});

// Handle Post Update (Form Submission)
app.post("/api/posts/:id", async (req, res) => {
    try {
        const response = await axios.patch(
            `http://localhost:${PORT}/api/posts/${req.params.id}`,
            req.body
        );
        console.log("Post Updated:", response.data);
        res.redirect("/");
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Error updating post" });
    }
});

// Handle Delete Post
app.get("/api/posts/delete/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

        const index = posts.findIndex(post => post.id === id);
        if (index === -1) {
            return res.status(404).json({ message: "Post not found" });
        }

        const deletedPost = posts.splice(index, 1);

        console.log("Deleted Post:", deletedPost);
        res.json({ success: true, message: "Post deleted successfully", deletedPost });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Error deleting post" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
