import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function MemberUpdate() {
    const { auth, setAuth } = useAuth(); // 사용자 인증 정보
    const navigate = useNavigate();

    // 상태 관리
    const [password, setPassword] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [message, setMessage] = useState("");
    const [isPasswordVerified, setIsPasswordVerified] = useState(false); // 비밀번호 확인 여부

    // 비밀번호 확인
    const handlePasswordCheck = async () => {
        try {
            const response = await axios.post(
                "http://localhost:5000/member/verify-password",
                { email: auth.email, password }
            );
            if (response.data.success) {
                setMessage("비밀번호가 확인되었습니다. 사용자명을 변경하거나 탈퇴할 수 있습니다.");
                setIsPasswordVerified(true); // 비밀번호 확인 완료
            } else {
                setMessage("비밀번호가 일치하지 않습니다.");
                setIsPasswordVerified(false); // 비밀번호 확인 실패
            }
        } catch (error) {
            console.error("비밀번호 확인 중 오류 발생:", error);
            setMessage("비밀번호 확인에 실패했습니다.");
            setIsPasswordVerified(false);
        }
    };

    // 사용자명 변경
    const handleUsernameChange = async () => {
        if (!isPasswordVerified) {
            setMessage("비밀번호 확인을 먼저 해주세요.");
            return;
        }
        try {
            const response = await axios.patch(
                "http://localhost:5000/member/update-username",
                { email: auth.email, username: newUsername }
            );
            if (response.data.success) {
                setAuth({ ...auth, username: newUsername }); // 상태 업데이트
                setMessage("사용자명이 성공적으로 변경되었습니다.");
            } else {
                setMessage("사용자명 변경에 실패했습니다.");
            }
        } catch (error) {
            console.error("사용자명 변경 중 오류 발생:", error);
            setMessage("사용자명 변경에 실패했습니다.");
        }
    };

    // 회원 탈퇴
    const handleDeleteAccount = async () => {
        if (!isPasswordVerified) {
            setMessage("비밀번호 확인을 먼저 해주세요.");
            return;
        }
        const confirmDelete = window.confirm("정말로 탈퇴하시겠습니까?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete("http://localhost:5000/member/delete", {
                data: { email: auth.email }
            });
            if (response.data.success) {
                alert("계정이 성공적으로 삭제되었습니다.");
                setAuth(null); // 인증 정보 초기화
                navigate("/"); // 홈 화면으로 이동
            } else {
                setMessage("계정 삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("계정 삭제 중 오류 발생:", error);
            setMessage("계정 삭제에 실패했습니다.");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>회원정보 수정</h2>

            {/* 비밀번호 확인 */}
            <input
                type="password"
                placeholder="비밀번호 확인"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
            />
            <button onClick={handlePasswordCheck} style={styles.button}>
                비밀번호 확인
            </button>

            {/* 사용자명 변경 (비밀번호 확인 완료 후 활성화) */}
            <input
                type="text"
                placeholder="새 사용자명 입력"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                style={{
                    ...styles.input,
                    backgroundColor: isPasswordVerified ? "white" : "#f2f2f2",
                    cursor: isPasswordVerified ? "text" : "not-allowed",
                }}
                disabled={!isPasswordVerified} // 비밀번호 확인 안되면 입력 불가
            />
            <button
                onClick={handleUsernameChange}
                style={{
                    ...styles.button,
                    backgroundColor: isPasswordVerified ? "#4CAF50" : "#ccc",
                    cursor: isPasswordVerified ? "pointer" : "not-allowed",
                }}
                disabled={!isPasswordVerified} // 비밀번호 확인 안되면 버튼 비활성화
            >
                사용자명 변경
            </button>

            {/* 회원 탈퇴 (비밀번호 확인 완료 후 활성화) */}
            <button
                onClick={handleDeleteAccount}
                style={{
                    ...styles.deleteButton,
                    backgroundColor: isPasswordVerified ? "#f44336" : "#ccc",
                    cursor: isPasswordVerified ? "pointer" : "not-allowed",
                }}
                disabled={!isPasswordVerified} // 비밀번호 확인 안되면 버튼 비활성화
            >
                회원 탈퇴
            </button>

            {message && <p style={styles.message}>{message}</p>}
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f9f9f9",
    },
    title: {
        marginBottom: "20px",
        fontSize: "24px",
        color: "#333",
    },
    input: {
        width: "300px",
        padding: "10px",
        margin: "10px 0",
        border: "1px solid #ddd",
        borderRadius: "5px",
        fontSize: "16px",
    },
    button: {
        width: "320px",
        padding: "10px",
        marginTop: "10px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer",
    },
    deleteButton: {
        width: "320px",
        padding: "10px",
        marginTop: "20px",
        backgroundColor: "#f44336",
        color: "white",
        border: "none",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer",
    },
    message: {
        color: "#d9534f",
        marginTop: "10px",
    },
};

export default MemberUpdate;
