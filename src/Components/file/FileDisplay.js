import React from 'react';
import "../../Css/fileDisplay.css"; // 추가: 스타일 파일 import

const FileDisplay = (props) => {
    const boardId = props.boardId; // 게시글 ID
    const files = props.files; // 파일 목록
    const basePath = "C:/Users/yunhs/Desktop/DBG/proj/backend/uploads"; // 로컬 저장소 경로

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
                            {/* 파일 다운로드 버튼 */}
                            [<a
                                href={`http://localhost:5000/board/${boardId}/file/download?filePath=${encodeURIComponent(
                                    `${basePath}/${file.fileId}_${file.originFileName}`
                                )}`}
                                download
                            >
                                Download
                            </a>]
                            &nbsp;
                            <strong>File Name:</strong>
                            &nbsp; {file.originFileName}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileDisplay;
