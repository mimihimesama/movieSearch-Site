// 로컬 스토리지에서 해당 영화의 데이터를 검색하고 로드
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
let movie = JSON.parse(localStorage.getItem(id));

// DOMContentLoaded 이벤트 핸들러
window.addEventListener("DOMContentLoaded", () => {
  // 영화 상세 정보 표시
  displayDetail(movie);

  loadReviewsFromLocalStorage();

  // 리뷰 추가 기능
  document.getElementById("submit-btn").addEventListener("click", function () {
    // 입력된 리뷰 내용, 사용자 ID, 비밀번호 가져오기
    let reviewcomment = document.getElementById("write-comment").value;
    let name = document.getElementById("comment-name").value;
    let pw = document.getElementById("comment-pw").value;

    // 리뷰 내용 입력 확인 (10자 이상)
    if (reviewcomment.trim().length < 10) {
      alert("리뷰 내용은 최소 10자 이상이어야 합니다.");
      return;
    }

    // ID 입력 확인
    if (name.trim() === "") {
      alert("사용자 ID를 입력해주세요.");
      return;
    }

    // 비밀번호 입력 확인
    if (pw.trim() === "") {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    // 비밀번호 유효성 검사 ( 영문2자, 숫자2자 ) 확인
    if (!isValidPassword(pw)) {
      alert("비밀번호는 영문 2자리와 숫자 2자리 이상을 포함해야 합니다.");
      return;
    }

    // 리뷰 요소 생성
    const reviewElement = document.createElement("div");
    reviewElement.classList.add("review-item");

    // 리뷰 내용 수정 및 삭제 버튼 추가
    reviewElement.innerHTML = `
      <p><strong>${name}</strong></p>
      <hr>
      <p>${reviewcomment}</p>
      <button class="edit-btn">수정</button> 
      <button class="delete-btn">삭제</button> 
    `;

    // 수정 버튼 이벤트 처리
    const editButton = reviewElement.querySelector(".edit-btn");
    editButton.addEventListener("click", function () {
      // 수정 버튼 비밀번호 입력 prompt
      const userInputpw = prompt("비밀번호를 입력하세요:");
      if (userInputpw !== pw) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      // 비밀번호 입력 후 수정 prompt
      const newReviewComment = prompt("새로운 리뷰 내용을 입력하세요:", reviewcomment);
      if (newReviewComment !== null) {
        reviewcomment = newReviewComment;
        reviewElement.querySelector("p:nth-child(3)").innerText = reviewcomment;
        // 수정된 리뷰 내용을 로컬 스토리지에 업뎃
        updateReviewInLocalStorage(id, name, reviewcomment, pw);
      }
    });

    // 삭제 버튼 이벤트 처리
    const deleteButton = reviewElement.querySelector(".delete-btn");
    deleteButton.addEventListener("click", function () {
      // 삭제 버튼 비밀번호 입력 prompt
      const userInputpw = prompt("비밀번호를 입력하세요:");
      if (userInputpw !== pw) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      // 리뷰 요소 삭제
      reviewElement.remove();
      // 로컬 스토리지에서 해당 리뷰 삭제
      removeReviewFromLocalStorage(id, name);
    });

    // 리뷰 추가
    const reviewSection = document.getElementById("review");
    reviewSection.appendChild(reviewElement);

    // 리뷰 입력창 빈칸 초기화
    document.getElementById("write-comment").value = "";
    document.getElementById("comment-name").value = "";
    document.getElementById("comment-pw").value = "";

    // 리뷰를 로컬 스토리지에 저장
    saveReviewToLocalStorage(id, name, reviewcomment, pw);
  });

  // 비밀번호 유효성 검사 함수
  function isValidPassword(pw) {
    let spellcount = 0;
    let numbercount = 0;

    // 비밀번호의 각 문자를 검사하여 영문자와 숫자를 카운트
    for (let char of pw) {
      if (/[a-zA-Z]/.test(char)) {
        spellcount++;
      } else if (/\d/.test(char)) {
        numbercount++;
      }
    }

    // 영문자가 2자리 이상이고 숫자가 2자리 이상이면 유효한 비밀번호로 판단
    return spellcount >= 2 && numbercount >= 2;
  }

  // 로컬 스토리지에서 리뷰 로드 함수
  function loadReviewsFromLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key.startsWith("review_")) {
        let parts = key.split("_");
        let movieId = parts[1];
        let userIntel = JSON.parse(localStorage.getItem(key));
        let name = userIntel[0];
        let reviewcomment = userIntel[1];
        let pw = userIntel[2];
        if (movieId === id) {
          addReviewToPage(name, reviewcomment, pw);
        }
      }
    }
  }

  // 리뷰를 페이지에 추가하는 함수
  function addReviewToPage(name, reviewcomment, pw) {
    const reviewElement = document.createElement("div");
    reviewElement.classList.add("review-item");

    reviewElement.innerHTML = `
      <p><strong>${name}</strong></p>
      <hr>
      <p>${reviewcomment}</p>
      <button class="edit-btn">수정</button> 
      <button class="delete-btn">삭제</button> 
    `;

    const editButton = reviewElement.querySelector(".edit-btn");
    editButton.addEventListener("click", function () {
      const userInputpw = prompt("비밀번호를 입력하세요:");
      if (userInputpw !== pw) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      const newReviewComment = prompt("새로운 리뷰 내용을 입력하세요:", reviewcomment);
      if (newReviewComment !== null) {
        reviewcomment = newReviewComment;
        reviewElement.querySelector("p:nth-child(3)").innerText = reviewcomment;
        updateReviewInLocalStorage(id, name, reviewcomment, pw);
      }
    });

    const deleteButton = reviewElement.querySelector(".delete-btn");
    deleteButton.addEventListener("click", function () {
      const userInputpw = prompt("비밀번호를 입력하세요:");
      if (userInputpw !== pw) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      reviewElement.remove();
      removeReviewFromLocalStorage(id, name);
    });

    const reviewSection = document.getElementById("review");
    reviewSection.appendChild(reviewElement);
  }

  // 로컬 스토리지에 리뷰 저장 함수
  function saveReviewToLocalStorage(movieId, name, reviewcomment, pw) {
    let userIntel = [name, reviewcomment, pw];
    localStorage.setItem(`review_${movieId}_${name}`, JSON.stringify(userIntel));
  }

  // 로컬 스토리지에서 리뷰 삭제 함수
  function removeReviewFromLocalStorage(movieId, name) {
    localStorage.removeItem(`review_${movieId}_${name}`);
  }

  // 로컬 스토리지에서 리뷰 수정 함수
  function updateReviewInLocalStorage(movieId, name, reviewcomment, pw) {
    let userIntel = [name, reviewcomment, pw];
    localStorage.setItem(`review_${movieId}_${name}`, JSON.stringify(userIntel));
  }
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
