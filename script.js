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

setInterval(nextSlide, 3000); 


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


async function fetchSearchMovies(query) {
  if (!query.trim()) return;

  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    displaySearchMovies(data.results, query);
  } catch (err) {
    console.error("Search error:", err);
  }
}
function displaySearchMovies(movies, query) {
  currentMovies = movies;
  const resultSection = document.getElementById("search-results");
  const searchRow = document.getElementById("search-row");
  const label = document.getElementById("search-label-tag");

  resultSection.style.display = "block";
  searchRow.innerHTML = "";

  label.innerHTML = `🔍 Results for "${query}"`;
  
  if(!movies || movies.length === 0) {
    searchRow.innerHTML = `<p style="color:#aaa; width:100%; text-align:center;">No results found for "${query}". Please try a different search.</p>`;
    resultSection.scrollIntoView({ behavior: "smooth" });
    return;
  }

  currentMovies.forEach(movie => {
    const poster = movie.poster_path
      ? IMAGE_URL + movie.poster_path
      : "https://via.placeholder.com/440x660?text=No+Image";

    searchRow.innerHTML += `
      <div class="movie-card">
        <img src="${poster}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>⭐ ${movie.vote_average.toFixed(1)}</p>
        <button class="watchlist-btn" onclick="addToWatchlist(${movie.id})">
          Add to Watchlist
        </button>
      </div>
    `;
  });

  resultSection.scrollIntoView({ behavior: "smooth" });
}
function scrollSearch(direction) {
  const container = document.getElementById("search-row");
  if (container) {
    container.scrollBy({ left: direction * 300, behavior: "smooth" });
  }
}

document.getElementById("search-btn").addEventListener("click", () => {
  const query = document.getElementById("search-input").value;
  fetchSearchMovies(query);
});

document.getElementById("search-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = document.getElementById("search-input").value;
    fetchSearchMovies(query);
  }
});


const genres = {
  horror: 27,
  scifi: 878,
  thriller: 53,
  romance: 10749,
  comedy: 35
};

async function fetchGenreMovies(genreId, containerId) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
    );

    const data = await res.json();
    displayMovies(data.results, containerId);

  } catch (error) {
    console.error(error);
  }
}

function displayMovies(movies, containerId) {
  const container = document.getElementById(containerId);
  currentMovies=movies;
  const thisGenresMovies = [...movies];
  
  movies.forEach(movie => {
    const card = document.createElement("div");
    

    card.innerHTML = `<div class="movie-card">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <h4>${movie.title}</h4>
      <p>⭐ ${movie.vote_average.toFixed(1)}</p>
      <button class = "watchlist-btn">
        Add to Watchlist
      </button>
     </div> 
    `;
    card.querySelector('.watchlist-btn').addEventListener('click', () => {
    
      currentMovies = thisGenresMovies;
      addToWatchlist(movie.id);
    })

    container.appendChild(card);
  });
}

function scrollRow(containerId, amount) {
  const row = document.getElementById(containerId);
  
  
  if (!row) return;

  row.scrollBy({
    left: amount,
    behavior: "smooth"
  });
}

fetchGenreMovies(genres.horror, "horror");
fetchGenreMovies(genres.scifi, "scifi");
fetchGenreMovies(genres.thriller, "thriller");
fetchGenreMovies(genres.romance, "romance");
fetchGenreMovies(genres.comedy, "comedy");

  


async function setMood(mood, emoji) {
  console.log("set mood")
  const genreId = moodGenres[mood];

  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`;

  try {
    const response = await fetch(url);
     if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    console.log(data)

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

  movies.forEach(movie => {
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


function addToWatchlist(movieId) {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

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

  const watchlistItem = {
    id: selectedMovie.id,
    title: selectedMovie.title,
    poster: selectedMovie.poster_path
      ? IMAGE_URL + selectedMovie.poster_path
      : "https://via.placeholder.com/440x660?text=No+Image",
    vote_average: selectedMovie.vote_average
  };

  watchlist.push(watchlistItem);

  localStorage.setItem(
    "watchlist",
    JSON.stringify(watchlist)
  );

  alert("Added to Watchlist");
}

