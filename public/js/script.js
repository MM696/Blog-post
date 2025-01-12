document.querySelector("#year").textContent = new Date().getFullYear();

document.addEventListener("DOMContentLoaded", () => {
    const createPostBtn = document.getElementById("createPostBtn");
    const createPostModal = document.getElementById("createPostModal");
    const closeModal = document.getElementById("closeModal");
    const postForm = document.getElementById("postForm");
    const postContainer = document.querySelector(".post-container");
    const postDetailModal = document.getElementById("postDetailModal");
    const closeDetailModal = document.getElementById("closeDetailModal");
    const detailTitle = document.getElementById("detailTitle");
    const detailDate = document.getElementById("detailDate");
    const detailDescription = document.getElementById("detailDescription");

    let editMode = false;
    let postBeingEdited = null;

    // Show the create post modal
    createPostBtn.addEventListener("click", () => {
        createPostModal.style.display = "flex";
    });

    // Close the create post modal
    closeModal.addEventListener("click", () => {
        createPostModal.classList.add("fadeOut");
        setTimeout(() => {
            createPostModal.style.display = "none";
            createPostModal.classList.remove("fadeOut");
            postForm.reset();
            editMode = false; // Reset edit mode
            postBeingEdited = null;
        }, 500);
    });

    // Handle post form submission
    postForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const postTitle = document.getElementById("postTitle").value.trim();
        const postDescription = document.getElementById("postDescription").value.trim();

        if (!postTitle || !postDescription) {
            alert("Please fill out all fields.");
            return;
        }

        if (editMode) {
            // Update the existing post
            const titleElement = postBeingEdited.querySelector(".post-title");
            const descriptionElement = postBeingEdited.querySelector(".post-description");
            const dateElement = postBeingEdited.querySelector(".post-date");

            titleElement.textContent = postTitle;
            titleElement.setAttribute("data-title", postTitle);
            titleElement.setAttribute("data-description", postDescription);

            descriptionElement.textContent = `${postDescription.substring(0, 100)}...`;

            editMode = false;
            postBeingEdited = null;
        } else {
            // Create a new post
            const currentDate = new Date();
            const formattedDate = `${currentDate.getDate()} ${currentDate.toLocaleString("default", { month: "short" })} ${currentDate.getFullYear()}`;

            const newPost = document.createElement("div");
            newPost.className = "post-box";
            newPost.innerHTML = `
                <h1 class="post-title" data-title="${postTitle}" data-date="${formattedDate}" data-description="${postDescription}">
                    ${postTitle}
                </h1>
                <span class="post-date">${formattedDate}</span>
                <p class="post-description">${postDescription.substring(0, 100)}...</p>
                <button class="delete-post" data-title="${postTitle}">Delete</button>
                <button class="edit-post" data-title="${postTitle}">Edit</button>
                <span class="view" data-title="${postTitle}" data-date="${formattedDate}" data-description="${postDescription}">View</span>
            `;

            postContainer.insertBefore(newPost, postContainer.firstChild);
        }

        document.getElementById("postCreatedMessage").style.display = "block";
        setTimeout(() => {
            document.getElementById("postCreatedMessage").style.display = "none";
        }, 3000);

        createPostModal.style.display = "none";
        postForm.reset();
    });

    // Event delegation for post container
    postContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("view") || event.target.classList.contains("post-title")) {
            const title = event.target.getAttribute("data-title");
            const date = event.target.getAttribute("data-date");
            const description = event.target.getAttribute("data-description");

            detailTitle.textContent = title;
            detailDate.textContent = date;
            detailDescription.textContent = description;

            postDetailModal.style.display = "flex";
        }

        if (event.target.classList.contains("delete-post")) {
            const postToDelete = event.target.closest(".post-box");
            postToDelete.classList.add("fadeOut");
            setTimeout(() => {
                postToDelete.remove();
            }, 500);
        }

        if (event.target.classList.contains("edit-post")) {
            // Edit the post
            const postToEdit = event.target.closest(".post-box");
            const title = postToEdit.querySelector(".post-title").getAttribute("data-title");
            const description = postToEdit.querySelector(".post-title").getAttribute("data-description");

            document.getElementById("postTitle").value = title;
            document.getElementById("postDescription").value = description;

            createPostModal.style.display = "flex";
            editMode = true;
            postBeingEdited = postToEdit;
        }
    });

    // Close the detail modal
    closeDetailModal.addEventListener("click", () => {
        postDetailModal.classList.add("fadeOut");
        setTimeout(() => {
            postDetailModal.style.display = "none";
            postDetailModal.classList.remove("fadeOut");
        }, 500);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
  
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  });
  