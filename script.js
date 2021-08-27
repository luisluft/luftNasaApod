const apiKey = "DEMO_KEY";
const count = 1;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];

async function getNasaPictures() {
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    console.log("resultsArray :", resultsArray);
  } catch (error) {
    console.log("error :", error);
  }
}

// On Load
getNasaPictures();
