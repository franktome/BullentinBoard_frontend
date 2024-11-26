import React, { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider"; // AuthContext 사용
import "../../css/fileDisplay.css"; // 스타일 파일 import

const FileManager = (props) => {
    const { auth } = useContext(AuthContext); // 사용자 인증 정보 가져오기
    const boardId = props.boardId;
    const files = props.files;
    const navigate = useNavigate();

    /* 파일 삭제 */
    const fileDelete = async (boardId, fileId) => {
        try {
            const response = await axios.delete(
                `http://localhost:5000/board/${boardId}/file/delete?fileId=${fileId}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`, // AuthContext에서 토큰 가져오기
                    },
                }
            );
            console.log("[FileManager.js] fileDelete() success :D");
            console.log(response.data);

            alert("파일 삭제 성공 :D");
            navigate(0); // 페이지 새로고침
        } catch (error) {
            console.error("[FileManager.js] fileDelete() error :<", error);
            alert("파일 삭제에 실패했습니다.");
        }
    };

    if (!files || files.length === 0) {
        return (
            <div className='file-box'>
                <p>No files</p>
            </div>
        );
    }

    return (
        <div className='file-box'>
            <ul>
                {files.map((file) => (
                    <li
                        key={file.fileId}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <span>
                            <strong>File Name:</strong> {file.originFileName} &nbsp;
                            {/* 파일 다운로드 버튼 */}
                            <a
                                href={`http://localhost:8989/board/${boardId}/file/download?fileId=${file.fileId}`}
                                download
                            >
                                Download
                            </a>
                        </span>
                        {/* 삭제 버튼 */}
                        <button
                            style={{ marginRight: '20px', cursor: 'pointer' }}
                            onClick={() => fileDelete(boardId, file.fileId)}
                        >
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileManager;
