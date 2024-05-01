// 로컬 스토리지에서 해당 영화의 데이터를 검색하고 로드
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
let movie = JSON.parse(localStorage.getItem(id));
