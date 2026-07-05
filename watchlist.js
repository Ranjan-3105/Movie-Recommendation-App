 const container = document.getElementById("container");
    const emptyText = document.getElementById("empty");
    const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

    function getWatchlist() {
      return JSON.parse(localStorage.getItem("watchlist")) || [];
    }

    function saveWatchlist(list) {
      localStorage.setItem("watchlist", JSON.stringify(list));
    }

    function renderWatchlist() {
      let watchlist = getWatchlist();

      container.innerHTML = "";

      if (watchlist.length === 0) {
        emptyText.innerText = "Your watchlist is empty 😴";
        return;
      } else {
        emptyText.innerText = "";
      }

      watchlist.forEach((movie) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const poster = movie.poster || (movie.poster_path
          ? IMAGE_URL + movie.poster_path
          : "https://via.placeholder.com/440x660?text=No+Image");

        card.innerHTML = `
      <img src="${poster}" alt="${movie.title}">
      <div class="card-body">
        <div class="title">${movie.title}</div>
        <button onclick="removeMovie(${movie.id})">
          Remove
        </button>
      </div>
    `;

        container.appendChild(card);
      });
    }

    function removeMovie(movieId) {
      let watchlist = getWatchlist();
      watchlist = watchlist.filter(movie => movie.id !== movieId);
      saveWatchlist(watchlist);
      renderWatchlist();
    }

    renderWatchlist();

    window.addEventListener("storage", event => {
      if (event.key === "watchlist") {
        renderWatchlist();
      }
    });