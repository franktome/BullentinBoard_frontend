import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import CommentWrite from "../comment/CommentWrite";
import CommentList from "../comment/CommentList";
import { useAuth } from "../context/AuthProvider";
import "../../Css/bbsdetail.css"; // 스타일 파일 import
import FileDisplay from "../file/FileDisplay"; // 파일 표시 컴포넌트

function BbsDetail() {
    const { auth } = useAuth(); // 사용자 인증 정보
    const [bbs, setBbs] = useState({});
    const { boardId } = useParams(); // URL 파라미터로 게시글 ID 가져오기
    const [hasIncremented, setHasIncremented] = useState(false);
    const navigate = useNavigate();

    // 게시글 상세 정보 가져오기
    const getBbsDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/board/${boardId}`);
            if (response.status === 404) {
                alert("게시글을 찾을 수 없습니다.");
                return;
            }
            setBbs(response.data);
        } catch (error) {
            console.error("게시글 정보를 불러오는 중 오류 발생:", error);
        }
    };
    // 조회수 증가 API 호출 함수
    const incrementViewCount = async () => {
        try {
            await axios.post(`http://localhost:5000/board/${boardId}/increment-view`);
        } catch (error) {
            console.error("조회수 증가 중 오류 발생:", error);
        }
    };

    // 게시글 삭제
    const deleteBbs = async () => {
        try {
            await axios.delete(`http://localhost:5000/board/${boardId}`);
            // alert("게시글이 삭제되었습니다.");
            navigate("/bbslist"); // 목록으로 이동
        } catch (error) {
            console.error("게시글 삭제 중 오류 발생:", error);
            alert("게시글 삭제에 실패했습니다.");
        }
    };

    // useEffect(() => {
    //     incrementViewCount();
    //     getBbsDetail(); // 컴포넌트가 로드될 때 게시글 정보 가져오기
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!hasIncremented) {
                    await incrementViewCount();
                    setHasIncremented(true); // 상태 업데이트로 중복 방지
                }
                await getBbsDetail();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, [hasIncremented]);

    const updateBbs = {
        boardId: bbs.id, // 응답 데이터에서 id가 정확히 있는지 확인
        writerName: bbs.writerName,
        title: bbs.title,
        content: bbs.content,
        files: bbs.files,
    };

    const parentBbs = {
        boardId: bbs.id,
        title: bbs.title,
    };

    return (
        <div className="bbs-detail-container">
            <div>
                <div className="my-3 d-flex justify-content-end">
                    {/* 글목록으로 이동 */}
                    <Link className="btn btn-outline-secondary" to="/bbslist">
                        <i className="fas fa-list"></i> 글목록
                    </Link>
                    &nbsp;

                    {/* 답글쓰기 */}
                    {/* <Link
                        className="btn btn-outline-secondary"
                        to={{
                            pathname: `/bbsanswer/${bbs.id}`,
                            state: { parentBbs: parentBbs },
                        }}
                    >
                        <i className="fas fa-pen"></i> 답글쓰기
                    </Link> */}
                    &nbsp;

                    {/* 자신이 작성한 게시글인 경우에만 수정, 삭제 가능 */}
                    {auth?.email === bbs.writerEmail || auth?.role === "ADMIN" ? (
                        <>
                            <Link
                                className="btn btn-outline-secondary"
                                to="/bbsupdate"
                                state={{ bbs: updateBbs }} // bbs 데이터 전달
                            >
                                <i className="fas fa-edit"></i> 수정
                            </Link>

                            &nbsp;
                            <button className="btn btn-outline-danger" onClick={deleteBbs}>
                                <i className="fas fa-trash-alt"></i> 삭제
                            </button>
                        </>
                    ) : null}
                </div>

                {/* 게시글 상세 정보 */}
                <table className="table table-striped">
                    <tbody>
                        <tr>
                            <th className="col-3">작성자</th>
                            <td>
                                <span>{bbs.writerEmail}</span>
                            </td>
                        </tr>
                        <tr>
                            <th>제목</th>
                            <td>
                                <span>{bbs.title}</span>
                            </td>
                        </tr>
                        <tr>
                            <th>작성일</th>
                            <td>
                                <span>{bbs.createdDate}</span>
                            </td>
                        </tr>
                        <tr>
                            <th>조회수</th>
                            <td>
                                <span>{bbs.viewCount}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* 게시글 내용 */}
                <div className="content-box">{bbs.content}</div>

                {/* 첨부파일 */}
                {bbs.files && bbs.files.length > 0 && (
                    <div className="attached-files">
                        <h5>첨부파일</h5>
                        <FileDisplay files={bbs.files} boardId={boardId} />
                    </div>
                )}

                {/* 댓글 리스트 */}
                <CommentList boardId={boardId} />

                {/* 댓글 작성 (로그인한 사용자만 가능) */}
                {auth && <CommentWrite boardId={boardId} />}
            </div>
        </div>
    );
}

export default BbsDetail;
