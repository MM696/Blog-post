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
    const welcomeMessage = document.getElementById("welcomeMessage");

    let editMode = false;
    let postBeingEdited = null;

    // Function to toggle the welcome message visibility
    const toggleWelcomeMessage = () => {
        if (postContainer.children.length === 0) {
            welcomeMessage.style.display = "block";
        } else {
            welcomeMessage.style.display = "none";
        }
    };

    // Show the create post modal
    createPostBtn.addEventListener("click", () => {
        createPostModal.style.display = "flex";
    });

    // Close the create post modal
    closeModal.addEventListener("click", () => {
        createPostModal.style.display = "none";
        postForm.reset();
        editMode = false;
        postBeingEdited = null;
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
            const titleElement = postBeingEdited.querySelector(".post-title");
            const descriptionElement = postBeingEdited.querySelector(".post-description");

            titleElement.textContent = postTitle;
            titleElement.setAttribute("data-title", postTitle);
            titleElement.setAttribute("data-description", postDescription);

            descriptionElement.textContent = `${postDescription.substring(0, 100)}...`;

            editMode = false;
            postBeingEdited = null;
        } else {
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
            `;

            postContainer.appendChild(newPost);
        }

        createPostModal.style.display = "none";
        postForm.reset();
        toggleWelcomeMessage();
    });

    // Event delegation for post container
    postContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-post")) {
            const postToDelete = event.target.closest(".post-box");
            postToDelete.remove();
            toggleWelcomeMessage();
        }

        if (event.target.classList.contains("edit-post")) {
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
        postDetailModal.style.display = "none";
    });

    // Initial call to set the welcome message visibility
    toggleWelcomeMessage();
});


document.addEventListener("DOMContentLoaded", () => {
    const navbarToggler = document.getElementById("navbarToggler");
    const navbarMenu = document.getElementById("container");

    navbarToggler.addEventListener("click", () => {
        navbarMenu.classList.toggle("active");
    });
});

