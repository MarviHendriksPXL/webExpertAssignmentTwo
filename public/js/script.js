
    const commentForm = document.getElementById("commentForm");
    const commentText = document.getElementById("commentText");
    const commentsList = document.getElementById("commentsList");
    const reactionForms = document.querySelectorAll("form[id^='commentForm-']");
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const searchQuery = searchInput.value;

        try {
            const response = await fetch(`/comments/?search=${encodeURIComponent(searchQuery)}`);
            if (response.ok) {
                const comments = await response.json();
                displayComments(comments);
            } else {
                const errorData = await response.json();
                console.error(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error("An unexpected error occurred:", error);
        }
    });
    function displayComments(comments) {
        // Update the displayed comments on the page
        // You may need to replace or modify this part based on how your comments are displayed
        commentsList.innerHTML = "";
        comments.forEach(comment => {
            const listItem = document.createElement("li");
            listItem.textContent = comment.text;
            commentsList.appendChild(listItem);
        });
    }
    commentForm.addEventListener("submit", async (event) => {
        event.preventDefault();  // Prevent the default form submission

        const text = commentText.value;
        const date = new Date().toISOString();

        if (text) {
                const response = await fetch("/comments/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ commentText: text, date: date }),
                });

                if (response.ok) {
                    const comment = await response.json();
                    const listItem = document.createElement("li");
                    listItem.textContent = comment.text;
                    commentsList.appendChild(listItem);
                    commentText.value = "";
                }
        }
    });

    reactionForms.forEach((reactionForm) => {
        reactionForm.addEventListener("submit", async (event) => {
            event.preventDefault();


            const commentId = reactionForm.id.replace("commentForm-", "");


            const reactionInput = reactionForm.querySelector("input[name='reaction']");
            const reactionText = reactionInput.value;

            if (reactionText) {
                // Send the reaction to the server
                const commentId = mongoose.Types.ObjectId(comment._id);
                const response = await fetch(`/comments/${commentId}/reactions`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ reaction: reactionText }),
                });

                if (response.ok) {

                    const updatedComment = await response.json();


                    const commentElement = document.getElementById(`comment-${commentId}`);
                    commentElement.textContent = updatedComment.text;


                    reactionInput.value = "";
                }
            }
        });
    });

    document.addEventListener("DOMContentLoaded", () => {
        const deleteForm = document.getElementById("deleteForm");
        const deleteDateInput = document.getElementById("deleteDate");

        deleteForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const deleteDate = new Date(deleteDateInput.value); // Keep it as a JavaScript Date object

            if (deleteDate) {
                const response = await fetch("/comments/delete-old", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ deleteDate }),
                });

                if (response.ok) {
                    // Optionally, handle success (e.g., show a message)
                    console.log("Old messages and reactions deleted successfully.");
                } else {
                    // Handle error (e.g., show an error message)
                    console.error("Error deleting old messages and reactions.");
                }
            }
        });
    });



