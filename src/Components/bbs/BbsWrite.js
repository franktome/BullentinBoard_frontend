import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import "../../Css/BbsWrite.css"; // CSS 파일 추가

function BbsWrite() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    const { auth } = useAuth();

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleContentChange = (e) => setContent(e.target.value);
    const handleChangeFile = (event) => {
        const selectedFiles = Array.from(event.target.files).slice(0, 5);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    };
    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const submitPost = async () => {
        if (!auth) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }

        const requestBody = {
            title,
            content,
            writerId: auth.id,
        };

        try {
            const response = await axios.post("http://localhost:5000/board/write", requestBody);
            const boardId = response.data.boardId;

            if (files.length > 0) {
                const formData = new FormData();
                files.forEach((file) => formData.append("files", file));
                await axios.post(`http://localhost:5000/board/${boardId}/file/upload`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            alert("글이 성공적으로 작성되었습니다!");
            setTitle("");
            setContent("");
            setFiles([]);
            navigate(`/bbsdetail/${boardId}`);
        } catch (error) {
            console.error("글 작성 중 오류 발생:", error);
            alert("글 작성에 실패했습니다.");
        }
    };

    // 게시글 목록으로 돌아가기
    const goToList = () => {
        navigate("/bbslist"); // BbsList.js 경로로 이동
    };

    return (
        <div className="bbs-write-container">
            <div className="form-wrapper">
                <h2 className="form-title">게시글 작성</h2>
                <table className="table form-table">
                    <tbody>
                        <tr>
                            <th className="form-label">작성자</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={auth?.username || "알 수 없음"}
                                    readOnly
                                />
                            </td>
                        </tr>
                        <tr>
                            <th className="form-label">제목</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={title}
                                    onChange={handleTitleChange}
                                    placeholder="제목을 입력하세요"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th className="form-label">내용</th>
                            <td>
                                <textarea
                                    className="form-control"
                                    value={content}
                                    onChange={handleContentChange}
                                    rows="10"
                                    placeholder="내용을 입력하세요"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th className="form-label">파일</th>
                            <td>
                                {files.map((file, index) => (
                                    <div key={index} className="file-item">
                                        <p className="file-name">
                                            <strong>Filename:</strong> {file.name}
                                        </p>
                                        <button
                                            className="btn btn-remove"
                                            type="button"
                                            onClick={() => handleRemoveFile(index)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                ))}
                                {files.length < 5 && (
                                    <input
                                        type="file"
                                        name="file"
                                        onChange={handleChangeFile}
                                        multiple="multiple"
                                        className="file-input"
                                    />
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="button-wrapper">
                    <button className="btn btn-submit" onClick={submitPost}>
                        <i className="fas fa-pen"></i> 작성하기
                    </button>
                    <button className="btn btn-back" onClick={goToList}>
                        <i className="fas fa-arrow-left"></i> 게시글로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BbsWrite;
