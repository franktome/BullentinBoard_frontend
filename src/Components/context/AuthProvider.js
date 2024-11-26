import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null); // 사용자 인증 정보 상태

    // 페이지 새로고침 시 LocalStorage에서 사용자 정보 로드
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setAuth(JSON.parse(user)); // JSON 문자열 -> 객체 변환
        }
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
