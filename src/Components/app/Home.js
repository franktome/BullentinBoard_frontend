import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider"; // Auth 상태 사용
import "../../Css/Home.css"; // 추가된 스타일 파일

function Home() {
  const { auth } = useAuth(); // 로그인 상태 확인
  const navigate = useNavigate();

  const handlePageNavigation = () => {
    if (auth) {
      navigate("/bbslist"); // 로그인 상태면 게시판 목록으로 이동
    } else {
      navigate("/login"); // 로그인 상태가 아니면 로그인 페이지로 이동
    }
  };

  return (
    <div className="home-container">
      <div className="home-jumbotron">
        <h1 className="home-title">Welcome to DGIST Community</h1>
        <p className="home-subtitle">
          Explore and engage with the community. Share your thoughts, ask questions,
          and connect with others through this DGIST board.
        </p>
        <hr className="home-divider" />
        <p className="home-description">
          Ready to get started? Check out the latest posts or create your own.
        </p>
        {/* 버튼 클릭 시 상태에 따라 동적 이동 */}
        <button className="home-button" onClick={handlePageNavigation}>
          Go to {auth ? "BBS List" : "Login Page"}
        </button>
        <div className="home-contact">
          <h5>📧 Contact me via email:</h5>
          <div>
            <a href="mailto:yunhs139@dgist.ac.kr">yunhs139@dgist.ac.kr</a>
          </div>
          <div>
            <a href="mailto:c12030@dgist.ac.kr">c12030@dgist.ac.kr</a>
          </div>
        </div>
      </div>
      <footer className="home-footer">
        <p>Copyright © DGIST Board</p>
      </footer>
    </div>
  );
}

export default Home;
