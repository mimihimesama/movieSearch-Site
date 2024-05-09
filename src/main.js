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
  const data = await response.json(); // JSON 데이터로 변환
  return data["results"]; // 영화 목록 반환
};

// HTML UPDATE
function displayMovies(movies) {
  const container = document.querySelector(".movie-wrap"); // 영화를 표시할 컨테이너 선택
  container.innerHTML = movies.map((movie) => createMovieCards(movie)).join(""); // 영화 카드 생성 및 컨테이너에 추가
  onClickCard(movies); // 각 카드에 클릭 이벤트 추가
}

const movieData = function (movies) {
  movies.forEach((movie) => {
    // 각 영화에 대해 JSON 형태로 변환하여 로컬 스토리지에 저장
    const mData = JSON.stringify({ movie });
    localStorage.setItem(movie.id, mData);
  });
};

// 영화 카드 생성 함수
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

// 각 영화 카드에 클릭 이벤트 추가 함수
const onClickCard = function (movies) {
  const cards = document.querySelectorAll(".movie-card");
  let movieId;
  cards.forEach((card) => {
    // 각 카드에 클릭 이벤트 리스너 추가
    card.addEventListener("click", function () {
      movieId = this.getAttribute("id"); // 클릭된 카드의 영화 ID 가져오기
      window.location.href = `/movieSearch-Site/sub.html?id=${movieId}`; // 페이지 이동
    });
  });
};

let filteredMovies = [];
let currentSearch = ""; // 현재 검색 키워드
let currentCountry = "all"; // 현재 선택된 국가, 기본값 'all'
let isAscending = false; // 평점 정렬 상태를 저장하는 전역 변수 (false는 내림차순, true는 오름차순)

const searchInput = document.getElementById("search-input");
const countryFilterDropdown = document.getElementById("country-filter");
const rateFilterButton = document.getElementById("filter-rate");

// 영화 검색 기능 함수
const findTitle = function (movies) {
  let search = searchInput.value.toLowerCase();

  // 검색 유효성 검사
  if (search.length === 0) {
    alert("검색어를 입력해주세요.");
    return;
  }

  currentSearch = search; // 검색어 업데이트
  currentCountry = "all"; // 국가 필터를 'all'로 리셋
  countryFilterDropdown.value = "all";
  filterAndDisplayMovies(movies);
};

// 이벤트 리스너 설정 함수
function setEventListeners(movies) {
  document.querySelector(".search").addEventListener("submit", (event) => {
    event.preventDefault();
    findTitle(movies);
  });

  countryFilterDropdown.addEventListener("change", () => {
    const previousCountry = currentCountry;
    currentCountry = countryFilterDropdown.value;
    if (!filterAndDisplayMovies(movies)) {
      countryFilterDropdown.value = previousCountry; // 결과가 없으면 드롭다운을 원래 값으로 되돌림
      currentCountry = previousCountry;
    }
  });

  rateFilterButton.addEventListener("click", () => {
    const previousState = isAscending;
    isAscending = !isAscending;
    if (!filterAndDisplayMovies(movies)) {
      isAscending = previousState; // 결과가 없으면 변경 취소
    } else {
      toggleArrow(rateFilterButton); // 결과가 있으면 토글 상태 변경
    }
  });
}

function filterAndDisplayMovies(movies) {
  filteredMovies = movies.filter((movie) => matchesFilters(movie));

  if (filteredMovies.length === 0) {
    alert("검색 결과가 없습니다. 다시 입력해주세요.");
    return false; // 실패를 나타내는 false 반환
  }

  sortMoviesByRate();
  setupPagination(filteredMovies);
  displayMoviesPaginated(filteredMovies, 1, 4);
  return true; // 성공을 나타내는 true 반환
}

function matchesFilters(movie) {
  return movie.title.toLowerCase().includes(currentSearch) && matchesCountry(movie);
}

function matchesCountry(movie) {
  const language = movie.original_language;
  const countryLanguages = {
    Korea: "ko",
    USA: "en",
    Japan: "ja",
    Others: ["ko", "en", "ja"]
  };
  return (
    currentCountry === "all" ||
    language === countryLanguages[currentCountry] ||
    (currentCountry === "Others" && !countryLanguages.Others.includes(language))
  );
}

function sortMoviesByRate() {
  filteredMovies.sort((a, b) => (isAscending ? a.vote_average - b.vote_average : b.vote_average - a.vote_average));
}

function toggleArrow(element) {
  element.textContent = element.textContent.slice(0, -1) + (element.textContent.endsWith("▲") ? "▼" : "▲");
}

window.onload = function () {
  loadmovies().then((movies) => {
    movieData(movies);
    displayMovies(movies);
    setEventListeners(movies);
    setupPagination(movies);
  });
};

// 페이징 설정 함수
function setupPagination(movies) {
  const itemsPerPage = 4; //페이지당 영화수
  const totalMovies = movies.length; // 총 영화수
  const totalPages = Math.ceil(totalMovies / itemsPerPage); // 총 페이지수

  const paginationContainer = document.querySelector(".pagination"); // .pagination 표시 컨테이너 - css
  paginationContainer.innerHTML = ""; // innerHTML 속성에 빈 문자열

  // 각 페이지 버튼 생성
  for (let i = 1; i <= totalPages; i++) {
    // 페이지수만큼 반복 , 반복에서 페이지 번호를 나타내는 버튼 생성
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      //페이지번호 i , 페이지당 영화수 itemsPerPage 를 받아 영화 목록 표시
      displayMoviesPaginated(movies, i, itemsPerPage);
    });
    paginationContainer.appendChild(pageButton); // 페이지네이션의 각 페이지 버튼 컨테이너 추가
  }
  const currentPage = 1;
  displayMoviesPaginated(movies, currentPage, itemsPerPage); // 초기 페이지 영화 목록 표시
}
// 페이지별 영화 표시 함수
function displayMoviesPaginated(movies, currentPage, itemsPerPage) {
  // displayMoviesPaginated 함수는 현재페이지 해당 목록 계산 후 화면 표시
  const startIndex = (currentPage - 1) * itemsPerPage; // 현재 페이지 영화 목록 시작 인덱스 설정
  const endIndex = Math.min(startIndex + itemsPerPage, movies.length); // 현재 페이지 영화 목록 끝 인덱스 설정
  const moviesToDisplay = movies.slice(startIndex, endIndex); // 시작부터 끝 인덱스 영화수를 배열에 저장(movieToDisplay)
  displayMovies(moviesToDisplay); // displayMovies 함수 호출
}
