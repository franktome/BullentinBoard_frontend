import React, { useRef } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import Comment from "./Comment.js";
import CommentWrite from "./CommentWrite.js"; // 댓글 작성 컴포넌트 import
import "../../Css/commentList.css"; // 스타일 파일 import

function CommentList(props) {
    const boardId = props.boardId;

    // Paging
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(5);
    const [totalCnt, setTotalCnt] = useState(0);
    const [commentList, setCommentList] = useState([]);

    // comment에서 참조
    const getCommentListRef = useRef(null);

    const changePage = (page) => {
        setPage(page);
        getCommentList(page);
    };

    const getCommentList = async (page) => {
        await axios
            .get(`http://localhost:5000/board/${boardId}/comment/list`, {
                params: { page: page - 1 },
            })
            .then((resp) => {
                console.log("[CommentList.js] getCommentList() success :D");
                console.log(resp.data);

                setPageSize(resp.data.pageSize);
                setTotalPages(resp.data.totalPages);
                setTotalCnt(resp.data.totalElements);
                setCommentList(resp.data.content);
            })
            .catch((err) => {
                console.log("[CommentList.js] getCommentList() error :<");
                console.log(err);
            });
    };

    useEffect(() => {
        getCommentListRef.current = getCommentList;
        getCommentList(1);
    }, [boardId]);

    return (
        <>
            {/* <div className="my-1 d-flex justify-content-center">
                <CommentWrite boardId={boardId} getCommentList={() => getCommentList(page)} />
            </div> */}

            <Pagination
                activePage={page}
                itemsCountPerPage={5}
                totalItemsCount={totalCnt}
                pageRangeDisplayed={5}
                prevPageText={"‹"}
                nextPageText={"›"}
                onChange={changePage}
				hideFirstLastPages={true}
            />
            {commentList.map(function (comment, idx) {
                return (
                    <div className="my-5" key={idx}>
                        <Comment
                            obj={comment}
                            key={idx}
                            page={page}
                            getCommentList={getCommentListRef.current}
                        />
                    </div>
                );
            })}
        </>
    );
}

export default CommentList;
