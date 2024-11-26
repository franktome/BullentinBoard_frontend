import axios from "axios";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function CommentWrite(props) {
    const { boardId } = useParams(); // URL 파라미터로 게시글 ID 가져오기
    const { auth } = useAuth();
    //const id = localStorage.getItem("id"); // 로컬 저장소에서 사용자 ID 가져오기
    const [content, setContent] = useState(""); // 댓글 내용 상태 관리
    const navigate = useNavigate();

    // 댓글 내용 변경 핸들러
    const changeContent = (event) => {
        setContent(event.target.value);
    };

    // 댓글 생성 함수
    const createComment = async () => {
        if (!auth || !auth.id) {
            alert("로그인 상태를 확인해주세요. 사용자 정보가 없습니다.");
            return;
        }

        const req = {
            content: content,
        };

        try {
            const response = await axios.post(
                `http://localhost:5000/board/${boardId}/comment/write`,
                req,
                {
                    headers: {
                        "User-ID": auth.id, // 사용자 ID를 헤더에 추가
                    },
                }
            );
            console.log("[CommentWrite.js] createComment() success :D");
            console.log(response.data);
            alert("댓글을 성공적으로 등록했습니다 :D");
            //props.getCommentList(); 
            navigate(0); // 페이지 새로고침
        } catch (error) {
            console.error("[CommentWrite.js] createComment() error :<", error);
            alert("댓글 등록에 실패했습니다.");
        }
    };

    return (
        <>
            {/* 상단 영역 (프로필 이미지, 댓글 작성자) */}
            <div className="my-1 d-flex justify-content-center">
                {/* <div className="col-1">
                    <img
                        src="/images/profile-placeholder.png"
                        alt="프로필 이미지"
                        className="profile-img"
                    />
                </div> */}

                <div className="col-7">
                    <span className="comment-id">{auth?.username || "익명"}</span>
                </div>
                <div className="col-2 my-1 d-flex justify-content-end">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={createComment}
                    >
                        <i className="fas fa-comment-dots"></i> 댓글 추가
                    </button>
                </div>
            </div>

            {/* 하단 영역 (댓글 내용 입력란) */}
            <div className="my-3 d-flex justify-content-center">
                <textarea
                    className="col-10"
                    rows="1"
                    value={content}
                    onChange={changeContent}
                ></textarea>
            </div>
            <br />
            <br />
        </>
    );
}

export default CommentWrite;
