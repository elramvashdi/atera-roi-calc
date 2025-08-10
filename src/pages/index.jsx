import Layout from "./Layout.jsx";
import AuthGuard from "../components/AuthGuard";
import Calculator from "./Calculator";

import Reports from "./Reports";
import Login from "./Login";
import Signup from "./Signup";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Calculator: Calculator,
    
    Reports: Reports,
    Login: Login,

    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                <Route path="/" element={<AuthGuard><Calculator /></AuthGuard> } />
                <Route path="/Calculator" element={<AuthGuard><Calculator /></AuthGuard> } />
                <Route path="/Reports" element={<AuthGuard><Reports /></AuthGuard> } />
                <Route path="/Login" element={<Login />} />
                <Route path="/Signup" element={<Signup />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}
