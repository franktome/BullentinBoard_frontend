import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // 모든 필드가 입력되었는지 확인하는 상태
    const isFormValid = email.trim() !== '' && username.trim() !== '' && password.trim() !== '';

    const handleRegister = async () => {
        setMessage('');
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, username, password })
        });

        const data = await response.json();
        if (response.ok) {
            setMessage("Registration successful!");
            setTimeout(() => {
                navigate('/'); // 회원가입 후 로그인 페이지로 이동
            }, 2000); // 2초 후에 이동
        } else {
            setMessage(data.message);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Register</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={styles.input}
            />
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={styles.input}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={styles.input}
            />
            <button
                onClick={handleRegister}
                style={{
                    ...styles.button,
                    backgroundColor: isFormValid ? '#4CAF50' : '#ccc',
                    cursor: isFormValid ? 'pointer' : 'not-allowed'
                }}
                disabled={!isFormValid} // 유효하지 않으면 비활성화
            >
                Register
            </button>
            {message && <p style={styles.message}>{message}</p>}
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
    },
    title: {
        marginBottom: '20px',
        fontSize: '24px',
        color: '#333',
    },
    input: {
        width: '300px',
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '16px',
    },
    button: {
        width: '320px',
        padding: '10px',
        marginTop: '20px',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
    },
    message: {
        color: '#d9534f',
        marginTop: '10px',
    },
};

export default RegisterPage;
