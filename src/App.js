import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import MainPage from "./components/MainPage";
import Search_task from "./components/Search_task"
import ChatAi from "./components/ChatAi"
import Analytics from "./components/Analytics"

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Определяем маршруты для разных вкладок */}
                <Route path="/" element={<MainPage />} />
                <Route path="/calendar" element={<MainPage />} />
                <Route path="/search-task" element={<Search_task />} />
                <Route path="/chat-ai" element={<ChatAi />} />
                <Route path="/analytics" element={<Analytics />} />
            </Routes>
        </Router>
    )
}

export default App;
