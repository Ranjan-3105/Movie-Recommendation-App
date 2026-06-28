const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

let index = 0;

function showSlide(n) {
  slides.forEach(slide => slide.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));

  slides[n].classList.add("active");
  dots[n].classList.add("active");
}

function nextSlide() {
  index++;
  if (index >= slides.length) index = 0;
  showSlide(index);
}

setInterval(nextSlide, 3000); // change every 3 sec


const API_KEY = "884c521ea68a850c28884fc00746252c";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const moodGenres = {
  happy: 35,
  sad: 18,
  excited: 28,
  thriller: 53,
  romantic: 10749,
  thoughtful: 878
};
console.log("test")
async function setMood(mood, emoji) {
  
  const genreId = moodGenres[mood];

  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`;

  try {
    const response = await fetch(url);
     if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    

    displayMoodMovies(data.results, mood, emoji);
  } catch (error) {
    console.log("Error:", error);
  }
}

let currentMovies = [];

function displayMoodMovies(movies, mood, emoji) {
  currentMovies = movies;
  const resultSection = document.getElementById("mood-results");
  const moodRow = document.getElementById("mood-row");
  const label = document.getElementById("mood-label-tag");

  resultSection.style.display = "block";
  moodRow.innerHTML = "";

  label.innerHTML = `${emoji} Movies for ${mood}`;

  movies.slice(0, 10).forEach(movie => {
    const poster = movie.poster_path
    ? IMAGE_URL + movie.poster_path
    : "https://via.placeholder.com/440x660?text=No+Image";

    moodRow.innerHTML += `
      <div class="movie-card">
        <img src="${poster}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>⭐ ${movie.vote_average.toFixed(1)}</p>
        <button class = "watchlist-btn" onclick="addToWatchlist(${movie.id})">
        Add to Watchlist
      </button>
      </div>
    `;
  });
  resultSection.scrollIntoView({behavior:"smooth"});
}



function scrollMood(direction) {
  const track = document.getElementById("mood-row");
  track.scrollBy({ left: direction * 500, behavior: "smooth" });
}


let watchlist = JSON.parse(
  localStorage.getItem("watchlist")
) || [];

function addToWatchlist(movieId) {

  const cards = document.querySelectorAll(".movie-card");

  let selectedMovie = null;

  currentMovies.forEach(movie => {
    if(movie.id === movieId){
      selectedMovie = movie;
    }
  });

  if(!selectedMovie) return;

  const exists = watchlist.some(
    movie => movie.id === movieId
  );

  if(exists){
    alert("Already in watchlist");
    return;
  }

  watchlist.push(selectedMovie);

  localStorage.setItem(
    "watchlist",
    JSON.stringify(watchlist)
  );

  alert("Added to Watchlist");
}