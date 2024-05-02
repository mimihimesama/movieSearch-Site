// movies api
export const loadMovies = async () => {
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
   //console.log(data['results']);
  return data["results"];
};

// HTML UPDATE
function displayMovies(movies) {
  const container = document.querySelector(".movie-wrap");
  container.innerHTML = movies.map(createMovieCard).join("");
  setEventListeners(movies);
}

// 영화 데이터 로컬에 저장 -> sub.js에서 해당 데이터를 로드하기 위해서
function movieData(movies) {
  if (localStorage.length === 0) {
    movies.forEach(movie => {
      const mData = JSON.stringify({ movie });
      localStorage.setItem(movie.id, mData);
    });
  }
}

// HTML list 만들기
function createMovieCard(movie) {
  return `
    <div class="movie-card" id="${movie.id}">
      <img src="https://image.tmdb.org/t/p/w400/${movie.poster_path}" class="movie_poster" />
      <h3 class="movie_title">${movie.title}</h3>
      <p class="movie_overview">${movie.overview}</p>
      <p class="movie_rate">⭐${movie.vote_average} <span class="movie_vote">(${movie.vote_count})</span></p>
    </div>`;
}

// 클릭 이벤트 id에 해당하는 상세 페이지로 이동하기
function setEventListeners(movies) {
  const cards = document.querySelectorAll(".movie-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const movieId = card.getAttribute("id");
      window.location.href = `http://127.0.0.1:5502/sub.html?id=${movieId}`;
    });
  });
}

// 검색 기능 : 대소문자 관계없이, enter입력해도 검색 클릭과 동일한 기능
const findTitle = function (movies) {
  // input값 가져와서 title과 비교하기
  let search = document.getElementById("search-input").value.toLowerCase();

  // 버튼 클릭이나 엔터 키 입력되었을 때 실행
  // 검색 유효성 검사
  if (search.length <= 0) {
    alert("검색어를 입력해주세요.");
  } else {
    const filtermovie = movies.filter((movie) => movie.title.toLowerCase().includes(search));

    if (filtermovie.length === 0) {
      alert("검색어에 해당하는 영화가 없습니다.");
    } else {
      displaymovies(filtermovie);
    }
  }
};

// 이벤트 관리
function setEventListeners(movies) {
  const form = document.querySelector(".search");
  // 검색창에 입력 수행 시
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    findTitle(movies);
  });
}

window.displayMovies = displaymovies;
window.movieData = movieData;

// main
async function initializePage() {
  const movies = await loadMovies();
  movieData(movies); // 로컬 스토리지에 영화 데이터 저장
  displayMovies(movies);
  orderByCountry(movies);
  orderByRate(movies);
  orderBySearch(movies);
  setupPagination(movies);
}

let filteredMovies = []; // 전역 변수로 필터링된 영화 목록 저장
let isAscending = false; // 평점 정렬 상태를 저장하는 전역 변수 (false는 내림차순, true는 오름차순)

// 페이지 로드 시 모든 영화를 필터링된 목록에 초기 설정
window.onload = function () {
  loadmovies().then((movies) => {
    filteredMovies = movies;
    displayMovies(filteredMovies); // 초기 영화 목록을 화면에 표시
  });
};

// 나라별 정렬
function orderByCountry(movies) {
  const dropdown = document.getElementById("country-filter");
  dropdown.addEventListener("change", () => {
    const selectedOption = dropdown.value;
    const filteredMovies = movies.filter(movie => {
      const language = movie.original_language;
      switch(selectedOption) {
        case "Korea":
          return language === "ko";
        case "USA":
          return language === "en";
        case "Japan":
          return language === "ja";
        case "Others":
          return !["ko", "en", "ja"].includes(language);
        default:
          return true;
      }
    });
    sortMoviesByRate(); // 국가 변경 후 현재 평점 정렬 상태를 유지하여 정렬
    displayMovies(filteredMovies); // 필터링된 목록을 디스플레이
  });
}

// 평점에 따른 영화를 정렬 , orderByRate 함수에 매개변수로 영화 목록 전달받아 정렬 // 전에 썼던 filteredMovies 는 함수 재사용이 떨어져 orderByRate 로 대체
function orderByRate(movies) {
  const element = document.getElementById("filter-rate");
  let isAscending = false;
  element.addEventListener("click", () => {
    isAscending = !isAscending;
    const sortedMovies = [...movies].sort((a, b) => (isAscending ? a.vote_average - b.vote_average : b.vote_average - a.vote_average));
    displayMovies(sortedMovies);
    toggleArrow(element);
  });
}

// 평점 정렬 함수
function toggleArrow(element) {
  element.textContent = element.textContent.slice(0, -1) + (element.textContent.endsWith("▲") ? "▼" : "▲");
}

// 검색 입력에 따라 영화를 정렬
function orderBySearch(movies) {
  const form = document.querySelector(".search");
  form.addEventListener("submit", event => {
    event.preventDefault();
    findMoviesByTitle(movies);
  });
}

// 페이지 로드 시 초기화
async function initializePage() {
  const movies = await loadMovies();
  displayMovies(movies);
  orderByCountry(movies);
  orderByRate(movies);
  orderBySearch(movies);
  setupPagination(movies);
}

// 페이징 처리
function setupPagination(movies) {
  const itemsPerPage = 5; // 페이지당 영화 수
  let currentPage = 1; // 현재 페이지

  // 페이지 수 계산
  const totalPages = Math.ceil(movies.length / itemsPerPage);

  // 페이지 이동 버튼 추가
  const paginationContainer = document.querySelector(".pagination");
  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  paginationContainer.appendChild(prevButton);
  paginationContainer.appendChild(nextButton);

  // 페이지 이동 버튼 이벤트 핸들러
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayMoviesPaginated(movies, currentPage, itemsPerPage);
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayMoviesPaginated(movies, currentPage, itemsPerPage);
    }
  });

  // 초기 페이지 표시
  displayMoviesPaginated(movies, currentPage, itemsPerPage);
}

// 현재 페이지에 해당하는 영화 목록을 표시
function displayMoviesPaginated(movies, currentPage, itemsPerPage) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const moviesToDisplay = movies.slice(startIndex, endIndex);
  displayMovies(moviesToDisplay);
}

