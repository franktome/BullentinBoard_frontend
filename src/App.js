import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from "./Components/context/AuthProvider";
import Home from "./Components/app/Home";
import Header from "./Components/app/Header";
import LoginPage from './Components/member/LoginPage';
import RegisterPage from './Components/member/RegisterPage';
import MemberUpdate from './Components/member/MemberUpdate';
import BbsList from './Components/bbs/BbsList';
import BbsWrite from './Components/bbs/BbsWrite';
import BbsDetail from './Components/bbs/BbsDetail';
import BbsUpdate from './Components/bbs/BbsUpdate';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/memberupdate" element={<MemberUpdate />} />
                    <Route path="/bbslist" element={<BbsList />} />
                    <Route path="/bbswrite" element={<BbsWrite />} />
                    <Route path="/bbsdetail/:boardId" element={<BbsDetail />} />
                    <Route path="/bbsupdate/" element={<BbsUpdate />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;