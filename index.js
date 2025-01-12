import express from "express";
import bodyParser from "body-parser";
import path from "path";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve the index page
app.get("/", (req, res) => {
    res.render("index");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
