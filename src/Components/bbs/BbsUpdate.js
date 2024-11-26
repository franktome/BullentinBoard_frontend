import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../Css/bbsupdate.css";

function BbsUpdate() {
    const location = useLocation();
    const { bbs } = location.state;
    const navigate = useNavigate();

    const [title, setTitle] = useState(bbs.title);
    const [content, setContent] = useState(bbs.content);
    const [files, setFiles] = useState([]);
    const [serverFiles, setServerFiles] = useState(bbs.files || []);

    const changeTitle = (e) => setTitle(e.target.value);
    const changeContent = (e) => setContent(e.target.value);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files).slice(0, 5);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    };

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleRemoveServerFile = (index) => {
        setServerFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const updateBbs = async () => {
        console.log(bbs.boardId)
        try {
            const req = { title, content };

            if (!bbs.boardId) {
                alert("게시글 ID가 존재하지 않습니다.");
                return;
            }
            await axios.patch(`http://localhost:5000/board/${bbs.boardId}/update`, req);
            alert("게시글이 성공적으로 수정되었습니다!");
            navigate(`/bbsdetail/${bbs.boardId}`);
        } catch (err) {
            console.error("게시글 수정 중 오류 발생:", err);
            alert("게시글 수정에 실패했습니다.");
        }
    };

    return (
        <div className="bbs-update-container">
            <h2 style={{ textAlign: "center" }}>게시글 수정</h2>
            <table className="table">
                <tbody>
                    <tr>
                        <th>작성자</th>
                        <td>
                            <input type="text" value={bbs.writerName} readOnly />
                        </td>
                    </tr>
                    <tr>
                        <th>제목</th>
                        <td>
                            <input type="text" value={title} onChange={changeTitle} />
                        </td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td>
                            <textarea value={content} onChange={changeContent} rows="6" />
                        </td>
                    </tr>
                    <tr>
                        <th>파일</th>
                        <td>
                            <div className="file-box">
                                {serverFiles.length > 0
                                    ? serverFiles.map((file, index) => (
                                          <div key={index} className="file-item">
                                              <span>{file.originFileName}</span>
                                              <button
                                                  type="button"
                                                  onClick={() => handleRemoveServerFile(index)}
                                              >
                                                  x
                                              </button>
                                          </div>
                                      ))
                                    : <p>No files</p>}
                                <div className="file-select-box">
                                    <input
                                        type="file"
                                        name="file"
                                        multiple
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="button-container">
                <button className="btn" onClick={updateBbs}>
                    수정하기
                </button>
            </div>
        </div>
    );
}

export default BbsUpdate;
