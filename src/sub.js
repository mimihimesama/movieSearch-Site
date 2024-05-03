// 로컬 스토리지에서 해당 영화의 데이터를 검색하고 로드
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
let movie = JSON.parse(localStorage.getItem(id));

window.addEventListener("DOMContentLoaded", () => {
  displayDetail(movie);
  // 리뷰 기능
  document.getElementById("submit-btn").addEventListener("click", function () {
    let reviewcomment = document.getElementById("write-comment").value;
    let id = document.getElementById("comment-name").value;

    // 리뷰 요소 생성
    const reviewElement = document.createElement("div");
    reviewElement.classList.add("review-item");

    // 리뷰 내용 작성 및 삭제
    reviewElement.innerHTML = `
    <p><strong>${id}</strong></p>
    <p>${reviewcomment}</p>
    <button class="edit-btn">수정</button> 
    <button class="delete-btn">삭제</button> 
  `;

    // 수정 버튼 이벤트 처리
    const editButton = reviewElement.querySelector(".edit-btn");
    editButton.addEventListener("click", function () {
      const newReviewComment = prompt("새로운 리뷰 내용을 입력하세요:", reviewcomment);
      if (newReviewComment !== null) {
        reviewcomment = newReviewComment;
        reviewElement.querySelector("p:nth-child(2)").innerText = reviewcomment;
      }
    });

    // 삭제 버튼 이벤트 처리
    const deleteButton = reviewElement.querySelector(".delete-btn");
    deleteButton.addEventListener("click", function () {
      reviewElement.remove();
    });

    // 리뷰 추가
    const reviewSection = document.getElementById("review");
    reviewSection.appendChild(reviewElement);

    // 리뷰 입력창 초기화
    document.getElementById("write-comment").value = "";
    document.getElementById("comment-name").value = "";
    document.getElementById("comment-pw").value = "";
  });
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
        <h2 class="movie-title">${movie.title}</h2> 
        <h4 class="movie-detail">${movie.release_date}</h4>
        <h3 class="movie-desc">${movie.overview}</h3>
      </div>`;
  return detail_html;
};
