// post.js

let showNSFW = false; // Default to not showing NSFW posts

// Removed NSFW toggle event listener

async function fetchRedditPosts(subreddit) {
    const url = subreddit ? `https://www.reddit.com/r/${subreddit}/hot.json?limit=10` : `https://www.reddit.com/hot.json?limit=10`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.data.children.map(post => post.data);
    } catch (error) {
        console.error('Error fetching Reddit posts:', error);
    }
}

function createDetailedPostElement(post) {
    const postContainer = document.createElement('div');
    postContainer.classList.add('reddit-post');

    const postElement = document.createElement('div');
    postElement.classList.add('post-content');

    const titleLink = document.createElement('a');
    titleLink.href = `https://www.reddit.com${post.permalink}`;
    titleLink.target = '_blank'; // Open link in a new tab
    titleLink.rel = 'noopener noreferrer'; // Security measure

    const title = document.createElement('h2');
    title.textContent = post.title;
    titleLink.appendChild(title);
    postElement.appendChild(titleLink);

    // Add event listener to handle navigation within the app
    titleLink.addEventListener('click', (event) => {
        event.preventDefault();
        openPostInApp(post);
    });

    const author = document.createElement('p');
    author.classList.add('post-author');
    author.textContent = `Posted by u/${post.author}`;
    postElement.appendChild(author);

    const score = document.createElement('p');
    score.classList.add('post-score');
    score.textContent = `Score: ${post.score}`;
    postElement.appendChild(score);

    const comments = document.createElement('p');
    comments.classList.add('post-comments');
    comments.textContent = `${post.num_comments} comments`;
    postElement.appendChild(comments);

    // Check if the post is NSFW and if NSFW posts should be shown
    if (post.over_18 && !showNSFW) {
        const nsfwWarning = document.createElement('p');
        nsfwWarning.classList.add('nsfw-warning');
        nsfwWarning.textContent = 'This post is marked as NSFW.';
        postElement.appendChild(nsfwWarning);
        postContainer.appendChild(postElement);
        return postContainer; // Skip displaying media for NSFW posts
    }

    // Check if the post contains an image
    if (!post.media && post.preview && post.preview.images && post.preview.images.length > 0) {
        const imageUrl = post.preview.images[0].source.url.replace(/&amp;/g, '&'); // Fix URL encoding
        const image = document.createElement('img');
        image.src = imageUrl;
        image.alt = post.title;
        image.className = 'post-image';
        postElement.appendChild(image);
    }

    // Check if the post contains a video
    if (post.media && post.media.reddit_video) {
        const videoUrl = post.media.reddit_video.fallback_url;
        const video = document.createElement('video');
        video.src = videoUrl;
        video.controls = true;
        video.className = 'post-video';
        postElement.appendChild(video);
    }

    // Check if the post contains an embedded media

    // Check if the post contains a secure media embed
    if (post.secure_media_embed && post.secure_media_embed.content) {
        const secureEmbedContainer = document.createElement('div');
        secureEmbedContainer.className = 'post-embed';
        let secureEmbedContent = post.secure_media_embed.content;

        // Decode HTML entities
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = secureEmbedContent;
        secureEmbedContent = tempDiv.textContent || tempDiv.innerText || '';

        secureEmbedContainer.innerHTML = secureEmbedContent;
        postElement.appendChild(secureEmbedContainer);
    }

    // Create upvote button
    const upvoteButton = document.createElement('button');
    upvoteButton.textContent = 'Upvote';
    upvoteButton.classList.add('upvote-button');
    upvoteButton.addEventListener('click', () => {
        // Handle upvote logic here
        console.log(`Upvoted post: ${post.id}`);
    });

    postElement.appendChild(upvoteButton);

    postContainer.appendChild(postElement);
    return postContainer;
}

async function embedDetailedRedditPosts(subreddit) {
    const mainElement = document.querySelector('main');
    mainElement.innerHTML = ''; // Clear previous content

    const posts = await fetchRedditPosts(subreddit);

    posts.forEach(post => {
        const postElement = createDetailedPostElement(post);
        mainElement.appendChild(postElement);
    });
}

// Function to handle navigation within the app
async function openPostInApp(post) {
    const mainElement = document.querySelector('main');
    mainElement.innerHTML = ''; // Clear previous content

    const postElement = createDetailedPostElement(post);
    mainElement.appendChild(postElement);

    const comments = await fetchRedditComments(post.id);
    const commentsSection = createCommentsSection(comments, post.id);
    mainElement.appendChild(commentsSection);
}

async function fetchRedditComments(postId) {
    const url = `https://www.reddit.com/comments/${postId}.json`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data[1].data.children.map(comment => comment.data);
    } catch (error) {
        console.error('Error fetching Reddit comments:', error);
    }
}

// Function to add a comment to the server
async function addComment(postId, commentText) {
    // Logic to send the comment to the server and save it in the database.
    console.log(`Adding comment to post ${postId}: ${commentText}`);
}

// Function to create a comment form
function createCommentForm(postId) {
    const form = document.createElement('form');
    form.classList.add('comment-form');

    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Add a comment...';
    form.appendChild(textarea);

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Post Comment';
    form.appendChild(submitButton);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const commentText = textarea.value.trim();
        if (commentText) {
            await addComment(postId, commentText);
            textarea.value = ''; // Clear the textarea
            // Optionally, you can re-fetch and display the comments here
        }
    });

    return form;
}

// Function to handle upvote and downvote actions
async function voteOnComment(commentId, voteType) {
    // Logic to send the vote to the server and update the comment score
    console.log(`Voting on comment ${commentId}: ${voteType}`);
    // Simulate updating the score for demonstration purposes
    const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`);
    const scoreElement = commentElement.querySelector('.comment-score');
    let currentScore = parseInt(scoreElement.textContent);
    if (voteType === 'upvote') {
        currentScore += 1;
    } else if (voteType === 'downvote') {
        currentScore -= 1;
    }
    scoreElement.textContent = currentScore;
}

// Add event listeners to upvote and downvote buttons
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('upvote-button')) {
        const commentElement = event.target.closest('.reddit-comment');
        const commentId = commentElement.dataset.commentId;
        voteOnComment(commentId, 'upvote');
    } else if (event.target.classList.contains('downvote-button')) {
        const commentElement = event.target.closest('.reddit-comment');
        const commentId = commentElement.dataset.commentId;
        voteOnComment(commentId, 'downvote');
    }
});

// Function to create a Reddit-style comment element
function createRedditCommentElement(comment) {
    const commentElement = document.createElement('div');
    commentElement.classList.add('reddit-comment');
    commentElement.dataset.commentId = comment.id; // Add unique identifier

    const voteContainer = document.createElement('div');
    voteContainer.classList.add('vote-container');

    const upvoteButton = document.createElement('button');
    upvoteButton.classList.add('upvote-button');
    upvoteButton.textContent = '▲';
    voteContainer.appendChild(upvoteButton);

    const score = document.createElement('p');
    score.classList.add('comment-score');
    score.textContent = comment.score;
    voteContainer.appendChild(score);

    const downvoteButton = document.createElement('button');
    downvoteButton.classList.add('downvote-button');
    downvoteButton.textContent = '▼';
    voteContainer.appendChild(downvoteButton);

    commentElement.appendChild(voteContainer);

    const contentContainer = document.createElement('div');
    contentContainer.classList.add('content-container');

    const author = document.createElement('p');
    author.classList.add('comment-author');
    author.textContent = `u/${comment.author}`;
    contentContainer.appendChild(author);

    const body = document.createElement('p');
    body.classList.add('comment-body');
    body.textContent = comment.body;
    contentContainer.appendChild(body);

    commentElement.appendChild(contentContainer);

    return commentElement;
}

// Function to create the comments section
function createCommentsSection(comments, postId) {
    const commentsContainer = document.createElement('div');
    commentsContainer.classList.add('comments-section');

    comments.forEach(comment => {
        const commentElement = createRedditCommentElement(comment);
        commentsContainer.appendChild(commentElement);
    });

    const addCommentSection = createCommentForm(postId);
    commentsContainer.appendChild(addCommentSection);

    return commentsContainer;
}

async function openPostInApp(post) {
    const mainElement = document.querySelector('main');
    mainElement.innerHTML = ''; // Clear previous content

    const postElement = createDetailedPostElement(post);
    mainElement.appendChild(postElement);

    const comments = await fetchRedditComments(post.id);
    const commentsSection = createCommentsSection(comments, post.id);
    mainElement.appendChild(commentsSection);
}

// Add event listener to the search bar
document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.querySelector('#search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', async (event) => {
            const subreddit = event.target.value;
            if (subreddit.length > 2) { // Start searching after 3 characters
                await embedDetailedRedditPosts(subreddit);
            }
        });
    }
});

// Initial call to display posts from a default subreddit
embedDetailedRedditPosts("");