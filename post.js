// post.js

async function fetchRedditPosts(subreddit) {
    const url = `https://www.reddit.com/r/${subreddit}/hot.json`;
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

// Add event listener to the search bar
const searchBar = document.querySelector('#search-bar');
if (searchBar) {
    searchBar.addEventListener('input', async (event) => {
        const subreddit = event.target.value;
        if (subreddit.length > 2) { // Start searching after 3 characters
            await embedDetailedRedditPosts(subreddit);
        }
    });
}embedDetailedRedditPosts("java");