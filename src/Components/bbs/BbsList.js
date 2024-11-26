import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import axios from "axios";
import "../../Css/BbsList.css"; // 필요한 CSS 파일을 별도로 작성

function BbsList() {
  const [bbsList, setBbsList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [searchOption, setSearchOption] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const pageSize = 10; // 한 페이지에 표시할 게시글 수

  // 데이터 가져오기
  const fetchBbsList = async (currentPage = 1) => {
    try {
      const response = await axios.get("http://localhost:5000/board/list", {
        params: {
          page: currentPage - 1,
          size: pageSize,
          option: searchOption,
          keyword: searchKeyword,
        },
      });
      setBbsList(response.data.content);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // 페이지 변경 시 호출
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
    fetchBbsList(pageNumber);
  };

  // 검색 버튼 클릭 시 호출
  const handleSearch = () => {
    setPage(1);
    fetchBbsList(1);
  };

  useEffect(() => {
    fetchBbsList();
  }, []);

  return (
    <div className="bbs-container">
      {/* 검색 섹션 */}
      <div className="search-section">
        <select
          className="search-select"
          value={searchOption}
          onChange={(e) => setSearchOption(e.target.value)}
        >
          <option value="">검색 옵션 선택</option>
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="writer">작성자</option>
        </select>
        <input
          className="search-input"
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          검색
        </button>
      </div>

      {/* 게시글 테이블 */}
      <table className="bbs-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {bbsList.length > 0 ? (
            bbsList.map((bbs, index) => (
              <tr key={bbs.id}>
                <td>{index + 1 + (page - 1) * pageSize}</td>
                <td>
                  <Link to={`/bbsdetail/${bbs.id}`} className="bbs-title-link">
                    {bbs.title}
                  </Link>
                </td>
                <td>{bbs.writer}</td>
                <td>{bbs.viewCount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">
                게시글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 페이징 */}
      <Pagination
        activePage={page}
        itemsCountPerPage={pageSize}
        totalItemsCount={totalElements}
        pageRangeDisplayed={5}
        prevPageText={"‹"}
        nextPageText={"›"}
        onChange={handlePageChange}
        className="pagination"
      />

      {/* 글쓰기 버튼 */}
      <div className="write-button-container">
        <Link to="/bbswrite" className="write-button">
          글쓰기
        </Link>
      </div>
    </div>
  );
}

export default BbsList;
