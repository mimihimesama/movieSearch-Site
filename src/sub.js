// 로컬 스토리지에서 해당 영화의 데이터를 검색하고 로드
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
let movie = JSON.parse(localStorage.getItem(id));

window.addEventListener("DOMContentLoaded", () => {
  displayDetail(movie);
});

/* 해당하는 영화 정보로 업데이트 */
const displayDetail = (data) => {
  const containerDetail = document.querySelector("#movie-info");
  containerDetail.innerHTML = createMovieDetail(data.movie);
};

/* detail 페이지를 구성할 HTML */
const createMovieDetail = (movie) => {
  let detail_html = `
      <img src="https://image.tmdb.org/t/p/w400/${movie.poster_path}" alt="영화 이미지" class="movie-img"/>
      <div class="movie-info">
        <h4 class="movie-rate">⭐ ${movie.vote_average}<span class=movie-vote> (${movie.vote_count})</span></h4>
        <h2 class="movie-title">${movie.original_title}</h2>
        <h4 class="movie-detail">${movie.release_date}</h4>
        <h3 class="movie-desc">${movie.overview}</h3>
      </div>`;
  return detail_html;
};
