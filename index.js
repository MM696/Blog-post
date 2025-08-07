import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config();

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


/* ==========================
   VIEW ROUTES
========================== */

// Home page: show all posts
app.get("/", async (req, res) => {
  const { data: posts, error } = await supabase
  .from("posts")
  .select("*")
  .order("created_at", { ascending: false });

console.log("Supabase posts fetch:", { posts, error });

if (error) {
  console.error("Error fetching posts:", error);
  return res.status(500).send("Failed to fetch posts");
}
    res.render("index", { posts });
});
// New post form
app.get("/new", (req, res) => {
  res.render("modify", { heading: "New Post", submit: "Create Post", post: null });
});

// Edit post form
app.get("/edit/:id", async (req, res) => {
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error || !post) {
    return res.status(404).send("Post not found");
  }

  res.render("modify", { heading: "Edit Post", submit: "Update Post", post });
});

/* ==========================
   API ROUTES
========================== */

// Create new post
app.post("/api/posts", async (req, res) => {
  const { title, content, author } = req.body;
  const { error } = await supabase
    .from("posts")
    .insert([{ title, content, author }]);

  if (error) {
    console.error("Create error:", error);
    return res.status(500).send("Failed to create post");
  }

  res.redirect("/");
});

// Update post
app.post("/api/posts/:id", async (req, res) => {
  const { title, content, author } = req.body;
  const { error } = await supabase
    .from("posts")
    .update({ title, content, author })
    .eq("id", req.params.id);

  if (error) {
    console.error("Update error:", error);
    return res.status(500).send("Failed to update post");
  }

  res.redirect("/");
});

// Delete post
app.get("/api/posts/delete/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      console.error("Error deleting post:", error.message);
      return res.status(500).send("Failed to delete post"); 
    }

    return res.redirect("/");
  } catch (err) {
    console.error("Server error:", err.message);
    return res.status(500).send("Internal server error"); 
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
