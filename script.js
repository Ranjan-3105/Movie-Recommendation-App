const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

const API_KEY = '884c521ea68a850c28884fc00746252c';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const moodGenres = {
  happy: 35,
  sad: 18,
  excited: 28,
  thriller: 53,
  romantic: 10749,
  thoughtful: 878
};

const genres = {
  horror: 27,
  scifi: 878,
  thriller: 53,
  romance: 10749,
  comedy: 35
};

let slideIndex = 0;
const cache = {};

function showSlide(index) {
  if (!slides || slides.length === 0) return;
  const i = (index >= 0 && index < slides.length) ? index : 0;
  slides.forEach(slide => slide.classList.remove('active'));
  if (dots && dots.length) dots.forEach(dot => dot.classList.remove('active'));
  slides[i].classList.add('active');
  if (dots && dots.length && dots[i]) dots[i].classList.add('active');
}

function nextSlide() {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}

function scrollTrack(trackId, amount) {
  const track = document.getElementById(trackId);
  if (!track) return;
  track.scrollBy({ left: amount, behavior: 'smooth' });
}

function scrollRow(trackId, amount) {
  scrollTrack(trackId, amount);
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}

function cacheMovies(movies) {
  if (!Array.isArray(movies)) return;
  movies.forEach(movie => {
    if (movie && movie.id) cache[movie.id] = movie;
  });
}

async function fetchSearchMovies(query) {
  const trimmed = query.trim();
  if (!trimmed) return;

  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(trimmed)}&language=en-US&page=1&include_adult=false`;
  const data = await fetchJson(url);
  cacheMovies(data.results);
  displaySearchMovies(data.results, trimmed);
}

function displaySearchMovies(movies, query) {
  const section = document.getElementById('search-results');
  const row = document.getElementById('search-row');
  const label = document.getElementById('search-label-tag');

  label.textContent = `Search results for "${query}"`;
  row.innerHTML = '';

  if (!movies || !movies.length) {
    row.innerHTML = '<div class="empty-message">No results found. Try a different title.</div>';
    section.classList.remove('section--hidden');
    section.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  movies.forEach(movie => {
    const poster = movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src="${poster}" alt="${movie.title}" />
      <div class="movie-card-content">
        <h3>${movie.title}</h3>
        <p>⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
      </div>
      <button class="watchlist-btn">Add to Watchlist</button>
    `;
    card.querySelector('.watchlist-btn').addEventListener('click', () => addToWatchlist(movie.id));
    row.appendChild(card);
  });

  section.classList.remove('section--hidden');
  section.scrollIntoView({ behavior: 'smooth' });
}


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

async function fetchTrendingMovies() {
  const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`;
  const data = await fetchJson(url);
  cacheMovies(data.results);
  displayMovies(data.results, 'trending-row');
}
fetchTrendingMovies();
async function setMood(mood, emoji) {
  const genreId = moodGenres[mood];
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US&page=1`;
  const data = await fetchJson(url);
  cacheMovies(data.results);
  displayMoodMovies(data.results, mood, emoji);
}

function displayMoodMovies(movies, mood, emoji) {
  const section = document.getElementById('mood-results');
  const row = document.getElementById('mood-row');
  const label = document.getElementById('mood-label-tag');

  label.textContent = `${emoji} picks for ${mood}`;
  row.innerHTML = '';

  if (!movies || !movies.length) {
    row.innerHTML = '<div class="empty-message">No recommendations available right now.</div>';
  } else {
    movies.forEach(movie => {
      const poster = movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
        <img src="${poster}" alt="${movie.title}" />
        <div class="movie-card-content">
          <h3>${movie.title}</h3>
          <p>⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
        </div>
        <button class="watchlist-btn">Add to Watchlist</button>
      `;
      card.querySelector('.watchlist-btn').addEventListener('click', () => addToWatchlist(movie.id));
      row.appendChild(card);
    });
  }

  section.classList.remove('section--hidden');
  section.scrollIntoView({ behavior: 'smooth' });
}

function scrollSearch(direction) {
  const container = document.getElementById('search-row');
  if (!container) return;
  container.scrollBy({ left: direction * 320, behavior: 'smooth' });
}

function scrollMood(direction) {
  const track = document.getElementById('mood-row');
  if (!track) return;
  track.scrollBy({ left: direction * 320, behavior: 'smooth' });
}

function addToWatchlist(movieId) {
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  const movie = cache[movieId];

  if (!movie) {
    alert('Unable to add movie. Please try again.');
    return;
  }

  if (watchlist.some(item => item.id === movieId)) {
    alert('Already in watchlist.');
    return;
  }

  watchlist.push({
    id: movie.id,
    title: movie.title,
    poster: movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'
  });

  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  alert(`${movie.title} added to watchlist.`);
}

window.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      fetchSearchMovies(searchInput.value);
    });

    searchInput.addEventListener('keypress', event => {
      if (event.key === 'Enter') {
        fetchSearchMovies(event.target.value);
      }
    });
  }


  
  showSlide(slideIndex);
  setInterval(nextSlide, 4000);
});
