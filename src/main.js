// movies api
export const loadmovies = async () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YjI1MWMwYjcyOWM5ZDI2OTZlMDZjNGQ0YTM4OWI2ZSIsInN1YiI6IjY2MmIyZDE1NmUwZDcyMDExYzFmN2JmYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GiFFRR5tmGJ2LoaVoS2ub_xksPO2gGRNSHX4rcPdJUI"
    }
  };
  const response = await fetch("https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1", options);
  const data = await response.json();
  return data["results"];
};

// HTML UPDATE
function displayMovies(movies) {
  const container = document.querySelector(".movie-wrap");
  container.innerHTML = movies.map((movie) => createMovieCards(movie)).join("");
  onClickCard(movies);
}

const movieData = function (movies) {
  if (localStorage.length === 0) {
    movies.forEach((movie) => {
      const mData = JSON.stringify({ movie });
      localStorage.setItem(movie.id, mData);
    });
  }
};

function createMovieCards(movie) {
  let temp_html = `
      <div class="movie-card" id="${movie.id}">
      <img
        src="https://image.tmdb.org/t/p/w400/${movie.poster_path}"
        class="movie_poster"
      />
        <h3 class="movie_title">${movie.title}</h3>
        <p class="movie_overview">
          ${movie.overview}
        </p>
        <p class="movie_rate">⭐${movie.vote_average}
          <span class="movie_vote">(${movie.vote_count})</span>
        </p>
    </div>
            `;
  return temp_html;
}

const onClickCard = function (movies) {
  const cards = document.querySelectorAll(".movie-card");
  let movieId;
  cards.forEach((card) => {
    card.addEventListener("click", function () {
      movieId = this.getAttribute("id");
      window.location.href = `http://127.0.0.1:5502/sub.html?id=${movieId}`; // 페이지 이동
    });
  });
};

let filteredMovies = [];

const findTitle = function (movies) {
  let search = document.getElementById("search-input").value.toLowerCase();

  if (search.length <= 0) {
    alert("검색어를 입력해주세요.");
  } else {
    filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(search));

    if (filteredMovies.length === 0) {
      alert("검색어에 해당하는 영화가 없습니다.");
    } else {
      sortMoviesByRate();
      setupPagination(filteredMovies);
      displayMoviesPaginated(filteredMovies, 1, 4);
    }
  }
};

function setEventListeners(movies) {
  const form = document.querySelector(".search");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    findTitle(movies);
  });
}

window.displayMovies = displayMovies;
window.movieData = movieData;

// main
loadmovies().then((movies) => {
  movieData(movies);
  displayMovies(movies);
  setEventListeners(movies);
  orderByCountry(movies);
  orderByRate(movies);
  setupPagination(movies); // 페이지 로드 시 페이징 처리 함수 호출 추가
});

let isAscending = false; // 평점 정렬 상태를 저장하는 전역 변수 (false는 내림차순, true는 오름차순)

window.onload = function () {
  loadmovies().then((movies) => {
    filteredMovies = movies;
    displayMovies(filteredMovies); // 초기 영화 목록을 화면에 표시
    setupPagination(movies); // 페이징 처리 함수 호출 추가
  });
};

function orderByCountry(movies) {
  const dropdown = document.getElementById("country-filter");

  dropdown.addEventListener("change", function () {
    const selectedOption = dropdown.value;

    filteredMovies = movies.filter((movie) => {
      const language = movie.original_language;

      if (selectedOption === "Korea") return language === "ko";
      if (selectedOption === "USA") return language === "en";
      if (selectedOption === "Japan") return language === "ja";
      if (selectedOption === "Others") return !["ko", "en", "ja"].includes(language);
      return true;
    });

    sortMoviesByRate();
    setupPagination(filteredMovies);
    displayMoviesPaginated(filteredMovies, 1, 4);
  });
}

function orderByRate(movies) {
  const element = document.getElementById("filter-rate");
  element.addEventListener("click", () => {
    isAscending = !isAscending;
    sortMoviesByRate();
    setupPagination(filteredMovies);
    displayMoviesPaginated(filteredMovies, 1, 4);
    toggleArrow(element);
  });
}

function sortMoviesByRate() {
  filteredMovies.sort((a, b) => (isAscending ? a.vote_average - b.vote_average : b.vote_average - a.vote_average));
}

function toggleArrow(element) {
  element.textContent = element.textContent.slice(0, -1) + (element.textContent.endsWith("▲") ? "▼" : "▲");
}

function setupPagination(movies) {
  const itemsPerPage = 4;
  const totalMovies = movies.length;
  const totalPages = Math.ceil(totalMovies / itemsPerPage);

  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      displayMoviesPaginated(movies, i, itemsPerPage);
    });
    paginationContainer.appendChild(pageButton);
  }
  const currentPage = 1;
  displayMoviesPaginated(movies, currentPage, itemsPerPage);
}

function displayMoviesPaginated(movies, currentPage, itemsPerPage) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, movies.length);
  const moviesToDisplay = movies.slice(startIndex, endIndex);
  displayMovies(moviesToDisplay);
}
