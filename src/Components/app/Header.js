import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import "../../Css/Header.css"; 

function Header() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false); // 드롭다운 상태 관리

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem("user");
    setTimeout(() => {
      navigate("/");
    }, 0);
  };

  // 드롭다운 표시/숨김 토글 함수
  const toggleDropdown = () => {
    if (auth) {
      // 로그인 상태일 때만 드롭다운을 토글
      setDropdownVisible(!dropdownVisible);
    }
  };

  return (
    <header className="header">
      <nav className="navbar">
        {/* 왼쪽 섹션 */}
        <div className="navbar-left">
          <Link className="nav-link" to="/">
            <i className="fas fa-home"></i> Home
          </Link>
          {auth && ( // 로그인 상태일 때만 드롭다운 표시
            <div className="dropdown">
              <div
                className="nav-link dropdown-toggle"
                onClick={toggleDropdown} // 클릭 시 드롭다운 토글
              >
                게시판
              </div>
              {dropdownVisible && ( // 드롭다운 메뉴가 표시될 조건
                <div className="dropdown-menu">
                  <Link className="dropdown-item" to="/bbslist">
                    글목록
                  </Link>
                  <Link className="dropdown-item" to="/bbswrite">
                    글추가
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 오른쪽 섹션 */}
        <div className="navbar-right">
          {auth ? (
            <>
              <span className="nav-user">{auth.username} 님 반갑습니다</span>
              {/* 회원정보 수정 버튼 추가 */}
              <Link className="nav-link" to="/memberupdate">
                회원정보 수정
              </Link>
              <Link className="nav-link" to="#" onClick={handleLogout}>
                로그아웃
              </Link>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">
                로그인
              </Link>
              <Link className="nav-link" to="/register">
                회원가입
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
