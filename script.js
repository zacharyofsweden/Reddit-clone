//variabel
//En post array för att lagra alla posts
const postArray = { posts: [] };
const maxPosts = 10;
//Läser in formulär och knapparna som behövs
const submitKnapp = document.getElementById("submit-button");
const plusKnapp = document.getElementById("plus-button");
const form = document.getElementById("post-form");

//Funktion att hämta Tiden.
function Hämtatid() {
  const date = new Date();
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleString('en-US', options);
}

//Funktion för att hämta all information om posten.
function Post(title, body, userId, flair, subreddit, reactions) {
  this.id = postArray.posts.length + 1; // Generate a unique id
  this.title = title;
  this.body = body;
  this.userId = userId;
  this.tags = flair;
  this.subreddit = subreddit;
  this.reactions = reactions;
  this.datetime = new Date().toISOString();
  this.date = new Date().toLocaleString();
}



//Fetchar Dummyjasons information för att skapa en post.
function fetchPostsFromDummyJSON() {
  fetch('https://dummyjson.com/posts')
    .then(response => response.json())
    .then(data => {
      postArray.posts = data.posts.map(apiPost => new Post(
        apiPost.title,
        apiPost.body,
        'dummyuser', // Default usernamn för dummy JSON posten.
        apiPost.tags,
        apiPost.subreddit,
        apiPost.reactions,
        apiPost.tags
      ));
      VisaPosts(maxPosts); // Limitar posten till 10.
    })
    .catch(error => console.error(error));
}

// Funktion för att visa själva posten. Kopplar det till feeden.
function VisaPosts(maxPosts) {
  const feed = document.getElementById("feed");
  feed.innerHTML = ""; // Clear existing posts

  postArray.posts.slice(0, maxPosts).forEach(post => {
    const postElement = skapaPostElement(post);
    feed.appendChild(postElement);
  });
}
// Skapar post element i HTML. 
function skapaPostElement(post) {
  const postElement = document.createElement("div");
  postElement.className = "post";
  postElement.id = post.id;

  const postHeader = skapaPostHeader(post);
  const postContent = skapaPostKontent(post);
  const postFooter = skapaPostFooter(post);

  postElement.appendChild(postHeader);
  postElement.appendChild(postContent);
  postElement.appendChild(postFooter);

  return postElement;
}

// Skapar post Header elementet i HTML. 
function skapaPostHeader(post) {
  const postHeader = document.createElement("div");
  postHeader.className = "post-header";

  postHeader.appendChild(skapaSpan("post-subreddit", `r/${post.subreddit || 'dummyJSON'}`));
  postHeader.appendChild(skapaSpan("post-author", `Posted by u/${post.userId || 'anonymous'}`));
  postHeader.appendChild(skapaSpan("post-time", post.date));
  postHeader.appendChild(skapaSpan("post-flair", post.tags));

  return postHeader;
}



function skapaSpan(className, textContent) {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = textContent;
  return span;
}


// Skapar post kontenetet elementet i HTML. 
function skapaPostKontent(post) {
  const postKontent = document.createElement("div");
  postKontent.className = "post-content";

  postKontent.appendChild(skapaHeading("h3", "post-title", post.title));
  postKontent.appendChild(skapaParagraph("post-body", post.body));

  return postKontent;
}


function skapaHeading(headingType, className, textContent) {
  const heading = document.createElement(headingType);
  heading.className = className;
  heading.textContent = textContent;
  return heading;
}

function skapaParagraph(className, textContent) {
  const paragraph = document.createElement("p");
  paragraph.className = className;
  paragraph.textContent = textContent;
  return paragraph;
}

// Skapar post footer elementet i HTML. 
function skapaPostFooter(post) {
  const postFooter = document.createElement("div");
  postFooter.className = "post-footer";

  postFooter.appendChild(skapaSpan("post-upvotes", `👍 Upvotes: ${post.reactions}`));
  postFooter.appendChild(skapaPostAlternativ());

  return postFooter;
}

// Skapar olika alternativ för att reporta, share eller save posten (Är inte funktionelt). 
function skapaPostAlternativ() {
  const postAlternativ = document.createElement("div");
  postAlternativ.className = "post-options";

  ["Report", "Share", "Save"].forEach(optionText => {
    postAlternativ.appendChild(createKnapp("post-button", `post-${optionText.toLowerCase()}`, optionText));
  });

  return postAlternativ;
}

// Skapar en knapp. 
function createKnapp(className, buttonType, textContent) {
  const Knapp = document.createElement("button");
  Knapp.className = `${className} ${buttonType}`;
  Knapp.textContent = textContent;
  return Knapp;
}

// läser in dom olike 10 posten när sidan laddas.
window.onload = fetchPostsFromDummyJSON;


//EventListener för knappen som öpnar formuläret.
plusKnapp.addEventListener("click", () => {
  form.style.display = form.style.display === "none" ? "flex" : "none";
});


//EventListener för knappen som postar formuläret.
submitKnapp.addEventListener("click", () => {
  const formulär = document.getElementById("post-form");

  const post = new Post(
    formulär.title.value,
    formulär.content.value,
    formulär.author.value,
    formulär.flair.value,
    formulär.subreddit.value,
    0
  );

  const postElement = skapaPostElement(post);

  const feed = document.getElementById("feed");
  feed.prepend(postElement);

  postArray.posts.push(post);

  formulär.reset();
  formulär.style.display = "none";
});
