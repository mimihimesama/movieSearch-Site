// 로컬 스토리지에서 해당 영화의 데이터를 검색하고 로드
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
let movie = JSON.parse(localStorage.getItem(id));

// DOMContentLoaded 이벤트 핸들러
window.addEventListener("DOMContentLoaded", () => {
  displayDetail(movie); // 영화 상세 정보 표시
  loadReviewsFromLocalStorage(); // 로컬 스토리지에서 리뷰를 로드하여 페이지에 표시

  document.getElementById("submit-btn").addEventListener("click", submitReview); // 리뷰 추가 기능
});

function submitReview() {
  const reviewComment = document.getElementById("write-comment").value;
  const name = document.getElementById("comment-name").value;
  const pw = document.getElementById("comment-pw").value;

  if (!validateReviewInputs(reviewComment, name, pw)) return; // 입력값 유효성 검사

  // 현재 영화 ID 가져오기
  const movieId = urlParams.get("id");

  // 리뷰 객체 생성
  const review = { id: Date.now(), name, reviewComment, pw, movieId }; // movieId 추가
  addReviewToPage(review);
  saveReviewToLocalStorage(review);
  resetReviewForm();
}

function validateReviewInputs(reviewComment, name, pw) {
  if (reviewComment.trim().length < 10) {
    alert("리뷰 내용은 최소 10자 이상이어야 합니다.");
    return false;
  }
  if (!name.trim()) {
    alert("사용자 ID를 입력해주세요.");
    return false;
  }
  if (!pw.trim()) {
    alert("비밀번호를 입력해주세요.");
    return false;
  }
  if (!isValidPassword(pw)) {
    alert("비밀번호는 영문 2자리와 숫자 2자리 이상을 포함해야 합니다.");
    return false;
  }
  return true;
}

// 페이지에 리뷰 요소 추가
function addReviewToPage(review) {
  const { id, name, reviewComment, pw } = review;
  const reviewElement = document.createElement("div");
  reviewElement.classList.add("review-item");
  reviewElement.innerHTML = `
    <p><strong>${name}</strong></p>
    <p>${reviewComment}</p>
    <button class="edit-btn">수정</button> 
    <button class="delete-btn">삭제</button>
  `;
  document.getElementById("review").appendChild(reviewElement);

  // 수정 및 삭제 버튼 이벤트 리스너
  reviewElement.querySelector(".edit-btn").addEventListener("click", () => editReview(id, reviewElement));
  reviewElement.querySelector(".delete-btn").addEventListener("click", () => deleteReview(id, reviewElement, pw));
}

// 비밀번호 유효성 검사
function isValidPassword(pw) {
  const spellCount = Array.from(pw).filter((char) => /[a-zA-Z]/.test(char)).length;
  const numberCount = Array.from(pw).filter((char) => /\d/.test(char)).length;
  return spellCount >= 2 && numberCount >= 2;
}

// 리뷰 수정 처리
function editReview(reviewId, reviewElement) {
  const pw = prompt("비밀번호를 입력하세요:");
  const storedReview = JSON.parse(localStorage.getItem(`review_${reviewId}`));

  if (pw !== storedReview.pw) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  const newReviewComment = prompt("새로운 리뷰 내용을 입력하세요:", storedReview.reviewComment);
  if (newReviewComment !== null) {
    storedReview.reviewComment = newReviewComment;
    reviewElement.querySelector("p:nth-child(2)").innerText = newReviewComment;
    updateReviewInLocalStorage(storedReview);
  }
}

// 리뷰 삭제 처리
function deleteReview(reviewId, reviewElement, pw) {
  const userInputPw = prompt("비밀번호를 입력하세요:");
  if (userInputPw !== pw) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }
  reviewElement.remove();
  removeReviewFromLocalStorage(reviewId);
}

// 로컬 스토리지에 리뷰 저장 함수
function saveReviewToLocalStorage(review) {
  localStorage.setItem(`review_${review.id}`, JSON.stringify(review));
}

// 로컬 스토리지에서 리뷰 수정 함수
function updateReviewInLocalStorage(review) {
  localStorage.setItem(`review_${review.id}`, JSON.stringify(review));
}

// 로컬 스토리지에서 리뷰 삭제 함수
function removeReviewFromLocalStorage(reviewId) {
  localStorage.removeItem(`review_${reviewId}`);
}

// 로컬 스토리지에서 리뷰 로드 함수
function loadReviewsFromLocalStorage() {
  const movieId = urlParams.get("id"); // 현재 페이지의 영화 ID 가져오기
  let reviews = []; // 리뷰들을 저장할 배열 초기화

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("review_")) {
      const review = JSON.parse(localStorage.getItem(key));
      // 현재 영화 ID와 일치하는 리뷰만 배열에 추가
      if (review.movieId === movieId) {
        reviews.push(review);
      }
    }
  });

  // 리뷰들을 id 기반으로 오름차순 정렬 (id가 낮은 것이 먼저 생성된 리뷰)
  reviews.sort((a, b) => a.id - b.id);

  // 정렬된 리뷰들을 페이지에 추가
  reviews.forEach((review) => addReviewToPage(review));
}

// 리뷰 입력창 빈칸 초기화
function resetReviewForm() {
  document.getElementById("write-comment").value = "";
  document.getElementById("comment-name").value = "";
  document.getElementById("comment-pw").value = "";
}

/* 해당하는 영화 정보로 업데이트 */
const displayDetail = (movie) => {
  const containerDetail = document.querySelector("#movie-info");
  containerDetail.innerHTML = createMovieDetail(movie);
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
