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
    let pw = document.getElementById("comment-pw").value;

    // 리뷰 내용 입력 확인
    if (reviewcomment.trim().length < 10) {
      alert("리뷰 내용은 최소 10자 이상이어야 합니다.");
      return;
    }

    // 사용자 ID 입력 확인
    if (id.trim() === "") {
      alert("사용자 ID를 입력해주세요.");
      return;
    }

    // 비밀번호 입력 확인
    if (pw.trim() === "") {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    // 비밀번호 유효성 검사 (4자 이상) alert
    if (!isValidPassword(pw)) {
      alert("비밀번호는 영문 2자리와 숫자 2자리 이상을 포함해야 합니다.");
      return;
    }

    let userIntel = [id, reviewcomment, pw];

    // 리뷰 저장
    localStorage.setItem(id, JSON.stringify(userIntel));

    // 저장소에서 정보 가져오기 - 유저이름
    let callName = () => {
      let userName = JSON.parse(localStorage.getItem(id));
      userName = userName[0];
      return userName;
    };

    // 저장소에서 정보 가져오기 - 리뷰내용
    let callComment = () => {
      let userComment = JSON.parse(localStorage.getItem(id));
      userComment = userComment[1];
      return userComment;
    };

    // 저장소에서 정보 가져오기 - 비밀번호
    let callPw = () => {
      let userPw = JSON.parse(localStorage.getItem(id));
      userPw = userPw[2];
      return userPw;
    };

    // 수정 절차
    const editComment = () => {
      const newReviewComment = prompt("새로운 리뷰 내용을 입력하세요:", callComment(id));
      if (newReviewComment !== null) {
        let editCom = JSON.parse(localStorage.getItem(id));
        editCom[1] = newReviewComment;
        localStorage.removeItem(id);
        localStorage.setItem(id, JSON.stringify(editCom));
        reviewElement.querySelector("p:nth-child(2)").innerText = callComment(id);
      }
    };

    // 삭제 절차
    const deleteComment = () => {
      localStorage.removeItem(id);
      reviewElement.remove();
      alert("삭제되었습니다.");
    };

    // 리뷰 요소 생성
    const reviewElement = document.createElement("div");
    reviewElement.classList.add("review-item");
    // 리뷰 내용 작성 및 삭제
    reviewElement.innerHTML = `
    <p><strong>${callName(id)}</strong></p>
    <p>${callComment(id)}</p>
    <button class="edit-btn">수정</button>
    <button class="delete-btn">삭제</button>
  `;
    // 수정 버튼 이벤트 처리
    const editButton = reviewElement.querySelector(".edit-btn");
    editButton.addEventListener("click", function () {
      const checkPw = prompt("비밀번호를 입력하세요:");
      checkPw == callPw(id) ? editComment() : alert("비밀번호가 틀렸습니다");
    });

    // 삭제 버튼 이벤트 처리
    const deleteButton = reviewElement.querySelector(".delete-btn");
    deleteButton.addEventListener("click", function () {
      const checkPw = prompt("비밀번호를 입력하세요:");
      checkPw == callPw(id) ? deleteComment() : alert("비밀번호가 틀렸습니다");
    });

    // 리뷰 추가
    const reviewSection = document.getElementById("review");
    reviewSection.appendChild(reviewElement);

    // 리뷰 입력창 초기화
    document.getElementById("write-comment").value = "";
    document.getElementById("comment-name").value = "";
    document.getElementById("comment-pw").value = "";
  });

  // 비밀번호 유효성 검사 함수
  function isValidPassword(pw) {
    let spellcount = 0;
    let numbercount = 0;

    // 비밀번호의 각 문자를 검사하여 영문자와 숫자를 카운트
    for (let test of pw) {
      if (/[a-zA-Z]/.test(test)) {
        spellcount++;
      } else if (/\d/.test(test)) {
        numbercount++;
      }
    }

    // 영문자가 2자리 이상이고 숫자가 2자리 이상이면 유효한 비밀번호로 판단
    return spellcount >= 2 && numbercount >= 2;
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
