// movies api
export const loadmovies = async () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YjI1MWMwYjcyOWM5ZDI2OTZlMDZjNGQ0YTM4OWI2ZSIsInN1YiI6IjY2MmIyZDE1NmUwZDcyMDExYzFmN2JmYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GiFFRR5tmGJ2LoaVoS2ub_xksPO2gGRNSHX4rcPdJUI",
    },
  };
  const response = await fetch(
    "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
    options
  );
  const data = await response.json();
  //console.log(data['results']);
  return data["results"];
};

// HTML UPDATE
function displaymovies(movies) {
  const container = document.querySelector(".movie-wrap");
  container.innerHTML = movies.map((movie) => createMovieCards(movie)).join("");
  onClickCard(movies);
}

// 영화 데이터 로컬에 저장
const movieData = function (movies) {
  if (localStorage.length === 0) {
    movies.forEach((movie) => {
      const mData = JSON.stringify({ movie });
      localStorage.setItem(movie.id, mData);
    });
  }
};

// HTML list 만들기
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

// 카드 클릭 시 영화 ID 표시
const onClickCard = function (movies) {
  document.querySelectorAll(".movie-card").forEach((card) => {
    card.addEventListener("click", function () {
      alert("영화 ID: " + this.id);
    });
  });
};

// 검색 기능 : 대소문자 관계없이, enter입력해도 검색 클릭과 동일한 기능
const findTitle = function (movies) {
  // input값 가져와서 title과 비교하기
  let search = document.getElementById("search-input").value.toLowerCase();

  // 버튼 클릭이나 엔터 키 입력되었을 때 실행
  // 검색 유효성 검사
  if (search.length <= 0) {
    alert("검색어를 입력해주세요.");
  } else {
    const filtermovie = movies.filter((movie) =>
      movie.title.toLowerCase().includes(search)
    );

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
loadmovies().then((movies) => {
  movieData(movies);
  displaymovies(movies);
  setEventListeners(movies);
  orderByTitle(movies);
  orderByRate(movies);
  orderByVote(movies);
  orderByCountry(movies);
});
