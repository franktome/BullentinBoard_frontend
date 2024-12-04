import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function Comment(props) {
    const { auth } = useAuth(); // 사용자 인증 정보
    const page = props.page;
    const comment = props.obj;
    const commentId = comment.commentId;
    const { boardId } = useParams(); // boardId 파라미터 가져오기

    const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
    const [content, setContent] = useState(comment.content); // 댓글 내용 상태
    const [loading, setLoading] = useState(false); // 로딩 상태

    // 댓글 내용 변경 핸들러
    const changeContent = (event) => {
        setContent(event.target.value);
    };

    // 수정 모드 토글
    const toggleEditMode = () => {
        setIsEditing((prev) => !prev);
    };

    // 댓글 수정
    const updateComment = async () => {
        if (auth?.username !== comment.writer) {
            alert("댓글 수정 권한이 없습니다.");
            return;
        }

        const req = {
            content: content.trim(),
            user_email: auth?.email, // 이메일 추가
        };

        try {
            setLoading(true); // 로딩 상태 활성화
            const response = await axios.patch(
                `http://localhost:5000/board/${boardId}/comment/update/${commentId}`,
                req
            );
            //alert("댓글이 성공적으로 수정되었습니다!");
            props.getCommentList(props.page); // 업데이트된 댓글 목록 다시 불러오기
            setIsEditing(false); // 수정 모드 종료
        } catch (error) {
            console.error("댓글 수정 중 오류 발생:", error);
            alert("댓글 수정에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false); // 로딩 상태 비활성화
        }
    };

    // 댓글 삭제
    const deleteComment = async () => {
        if (auth?.username !== comment.writer) {
            alert("댓글 삭제 권한이 없습니다.");
            return;
        }

        // if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
        //     return;
        // }

        const req = {
            user_email: auth?.email, // 이메일 추가
        };

        try {
            setLoading(true); // 로딩 상태 활성화
            const response = await axios.delete(
                `http://localhost:5000/board/${boardId}/comment/delete/${commentId}`,
                { data: req } // DELETE 요청의 data 속성
            );
            alert("댓글이 성공적으로 삭제되었습니다!");
            props.getCommentList(page); // 삭제된 댓글 목록 다시 불러오기
        } catch (error) {
            console.error("댓글 삭제 중 오류 발생:", error);
            alert("댓글 삭제에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false); // 로딩 상태 비활성화
        }
    };

    return (
        <div className="comment-container mb-4"> {/* 댓글 사이 간격 추가 */}
            {/* 상단 영역 */}
            <div className="comment-header d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <div className="ms-3 d-flex align-items-center">
                        <span className="comment-writer me-3">{comment.writer}</span>
                        <span className="comment-date text-muted">{comment.createdDate}</span>
                    </div>
                </div>

                {/* 수정/삭제 버튼 */}
                {(auth?.username === comment.writer || auth?.role === "ADMIN") && (
                    <div className="comment-actions">
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={toggleEditMode}
                            disabled={loading}
                        >
                            {isEditing ? "취소" : "수정"}
                        </button>
                        &nbsp;
                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={deleteComment}
                            disabled={loading}
                        >
                            삭제
                        </button>
                    </div>
                )}
            </div>

            {/* 댓글 수정 UI */}
            {isEditing ? (
                <div className="comment-edit mt-3">
                    <textarea
                        className="form-control"
                        rows="3"
                        value={content}
                        onChange={changeContent}
                        disabled={loading}
                    />
                    <div className="text-end mt-2">
                        <button
                            className="btn btn-dark btn-sm"
                            onClick={updateComment}
                            disabled={loading || !content.trim()}
                        >
                            {loading ? (
                                <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                                "수정 완료"
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="comment-content mt-3">{content}</div>
            )}
        </div>

    );
}

export default Comment;
