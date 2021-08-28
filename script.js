const API_KEY = "yzj10fV3ZLo1UaqfxZpmNSNfYfVgfikPKMc9Zt9p";
const count = 2;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=${count}`;
let resultsArray = [];
let favorites = {};

const resultsNavigation = document.querySelector("#results-navigation");
const favoritesNavigation = document.querySelector("#favorites-navigation");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

function showContent(page) {
  window.scrollTo({ top: 0, behavior: "instant" });

  if (page === "results") {
    resultsNavigation.classList.remove("hidden");
    favoritesNavigation.classList.add("hidden");
  }
  if (page === "favorites") {
    favoritesNavigation.classList.remove("hidden");
    resultsNavigation.classList.add("hidden");
  }

  loader.classList.add("hidden");
}

function createPictureCards(page) {
  const currentArray = page === "results" ? resultsArray : Object.values(favorites);
  currentArray.forEach((result) => {
    // Card container
    const card = document.createElement("div");
    card.classList.add("card");

    // Link element
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";

    //   Image element
    const image = document.createElement("img");
    image.src = result.url;
    image.alt = "NASA Picture of the Day";
    image.loading = "lazy";
    image.classList.add("card-image-top");

    // Card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // Card Title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;

    // Save Text
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    if (page === "results") {
      saveText.textContent = "Add to Favorites";
      saveText.setAttribute("onclick", `saveFavorite('${result.url}')`);
    } else {
      saveText.textContent = "Remove Favorite";
      saveText.setAttribute("onclick", `removeFavorite('${result.url}')`);
    }
    // Card Text
    const cardText = document.createElement("p");
    cardText.textContent = result.explanation;

    // Footer Container
    const footerContainer = document.createElement("small");
    footerContainer.classList.add("text-muted");

    // Date
    const date = document.createElement("strong");
    date.textContent = result.date;

    // Copyright
    const copyright = document.createElement("span");
    // ternary operator short syntax
    const copyrightResult = result.copyright === undefined ? "" : result.copyright;
    copyright.textContent = ` ${copyrightResult}`;

    // Append all elements
    footerContainer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footerContainer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

// page = 'favorites' || 'results'
function updateDOM(page) {
  if (localStorage.getItem("nasaFavorites")) favorites = JSON.parse(localStorage.getItem("nasaFavorites"));

  imagesContainer.textContent = "";
  createPictureCards(page);
  showContent(page);
}

async function getNasaPictures() {
  // Show loader
  loader.classList.remove("hidden");

  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM("results");
  } catch (error) {
    console.log("error :", error);
  }
}

function saveFavorite(itemUrl) {
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;

      // Show and hide the ADDED popup
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 1000);

      // Save in localStorage
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}

function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) delete favorites[itemUrl];

  // Save in localStorage
  localStorage.setItem("nasaFavorites", JSON.stringify(favorites));

  updateDOM("favorites");
}

// On Load
getNasaPictures();
