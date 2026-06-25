

document.addEventListener("mousemove",function(dets){
    document.querySelector("#cursor").style.left = dets.x + "px";
    document.querySelector("#cursor").style.top = dets.y + "px";
    document.querySelector("#cursor-blur").style.left = dets.x-150 + "px";
    document.querySelector("#cursor-blur").style.top = dets.y-150 + "px";
});
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


const API_KEY = "35f665b4d65439539024beac53f297d8";
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

function displayMoodMovies(movies, mood, emoji) {

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
        <button onclick="addToWatchlist(${movie.id})">
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

