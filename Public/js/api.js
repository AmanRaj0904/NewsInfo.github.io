console.log("api.js loaded at:", new Date().toISOString());

// Get DOM elements with retry
function getDomElements(callback) {
  const cardsContainer = document.getElementById("Card_Container");
  const cardTemplate = document.getElementById("card_template");

  if (!cardsContainer || !cardTemplate) {
    console.error("DOM elements not found yet!");
    console.log("Card_Container:", !!cardsContainer);
    console.log("card_template:", !!cardTemplate);
    document.body.innerHTML += "<p>Waiting for DOM elements...</p>";
    setTimeout(() => getDomElements(callback), 500);
    return;
  }

  console.log("DOM elements found:", { cardsContainer, cardTemplate });
  callback(cardsContainer, cardTemplate);
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded fired at:", new Date().toISOString());
  getDomElements((cardsContainer, cardTemplate) => {
    console.log("Starting app...");
    fetchNews("India", cardsContainer, cardTemplate);
  });
});

// Reload page
function reload() {
  window.location.reload();
}

// Fetch news
async function fetchNews(query, cardsContainer, cardTemplate) {
  const loadingDiv = document.createElement("div");
  loadingDiv.innerHTML = "<p>Loading...</p>";
  cardsContainer.innerHTML = ""; // Clear existing cards
  cardsContainer.appendChild(loadingDiv);

  try {
    console.log("Fetching news for:", query);
    const res = await fetch(`/api/news?q=${encodeURIComponent(query)}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.details || "Unknown server error");
    }

    const data = await res.json();
    console.log("API Response:", data);

    if (!data.articles || data.articles.length === 0) {
      cardsContainer.innerHTML = "<p>No articles found.</p>";
      return;
    }

    bindData(data.articles, cardsContainer, cardTemplate);
  } catch (error) {
    console.error("Fetch error:", error.message);
    cardsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Bind articles to UI
function bindData(articles, cardsContainer, cardTemplate) {
  console.log("Binding data with elements:", { cardsContainer, cardTemplate });
  cardsContainer.innerHTML = ""; // Clear loading message

  articles.forEach((article) => {
    if (!article.urlToImage) return;

    const cardClone = cardTemplate.cloneNode(true);
    cardClone.style.display = "block"; // Make visible
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

// Fill card with data
function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news_img");
  const newsTitle = cardClone.querySelector("#news_title");
  const newsDesc = cardClone.querySelector("#newsDesc");

  if (!newsImg || !newsTitle || !newsDesc) {
    console.error("Card elements missing in clone!");
    return;
  }

  newsImg.src = article.urlToImage;
  newsTitle.textContent = article.title || "No title";
  newsDesc.textContent = article.description || "No description";

  cardClone.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

// Navigation click handler
function onNavItemClick(id) {
  getDomElements((cardsContainer, cardTemplate) => {
    fetchNews(id, cardsContainer, cardTemplate);
  });
}

// Search functionality
document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("Search_button");
  const inputSearch = document.getElementById("Search_text");

  if (searchButton && inputSearch) {
    searchButton.addEventListener("click", () => {
      const query = inputSearch.value.trim();
      if (query) {
        getDomElements((cardsContainer, cardTemplate) => {
          fetchNews(query, cardsContainer, cardTemplate);
        });
      }
    });
  } else {
    console.error("Search elements not found!");
  }
});