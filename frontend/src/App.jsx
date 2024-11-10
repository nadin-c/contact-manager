import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ContactForm from "./pages/ContactForm";
import PublicCard from "./pages/PublicCard";
import ProtectedRoute from "./components/ProtectedRoute";
import PreviewCard from "./pages/PreviewCard";

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/card/:userId" element={<PublicCard />} />
            <Route path="/previewCard/:userId" element={<PreviewCard />} />
            <Route
                path="/contact-form"
                element={
                    <ProtectedRoute>
                        <ContactForm />
                    </ProtectedRoute>
                }
            />
        </Routes>
    </Router>
);

export default App;
