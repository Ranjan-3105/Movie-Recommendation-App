const container = document.getElementById('container');
const emptyText = document.getElementById('empty');
const IMAGE_URL = 'https://image.tmdb.org/t/p/w200';

function getWatchlist() {
  return JSON.parse(localStorage.getItem('watchlist')) || [];
}

function saveWatchlist(list) {
  localStorage.setItem('watchlist', JSON.stringify(list));
}

function renderWatchlist() {
  const watchlist = getWatchlist();
  container.innerHTML = '';
  if (watchlist.length === 0) {
    emptyText.innerText = 'Your watchlist is empty';
    return;
  }
  emptyText.innerText = '';

  watchlist.forEach(movie => {
    const item = document.createElement('div');
    item.className = 'watchlist-item';

    const poster = movie.poster || (movie.poster_path ? IMAGE_URL + movie.poster_path : 'https://via.placeholder.com/120x180?text=No+Image');

    item.innerHTML = `
      <img src="${poster}" alt="${movie.title}" />
      <div class="info">
        <div class="title">${movie.title}</div>
      </div>
      <button class="remove-btn">Remove</button>
    `;

    const btn = item.querySelector('.remove-btn');
    btn.addEventListener('click', () => removeMovie(movie.id));

    container.appendChild(item);
  });
}

function removeMovie(movieId) {
  let watchlist = getWatchlist();
  watchlist = watchlist.filter(m => m.id !== movieId);
  saveWatchlist(watchlist);
  renderWatchlist();
}

renderWatchlist();

window.addEventListener('storage', event => {
  if (event.key === 'watchlist') renderWatchlist();
});