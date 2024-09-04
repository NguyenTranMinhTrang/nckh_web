import React from "react";
// import { Route, Routes, HashRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import RequireAuth from "./pages/RequireAuth";
import { ROUTE_RIGHT } from "./constants/AppConstant";
import UnAuthorized from "./pages/UnAuthorized";
import Report from "./pages/Report";
import HomePage from "./pages/HomePage";
import Animal from "./pages/Animal";
import Contribute from "./pages/Contribute";
import User from "./pages/User";
import NotFound from "./pages/NotFound";

const AppNavigation = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<UnAuthorized />} />

            {/* Private path */}

            <Route element={<RequireAuth allowRight={ROUTE_RIGHT.report} />}>
                <Route path="/" element={<HomePage />} />
            </Route>

            <Route element={<RequireAuth allowRight={ROUTE_RIGHT.report} />}>
                <Route path="/user" element={<User />} />
            </Route>

            <Route element={<RequireAuth allowRight={ROUTE_RIGHT.report} />}>
                <Route path="/report" element={<Report />} />
            </Route>

            <Route element={<RequireAuth allowRight={ROUTE_RIGHT.report} />}>
                <Route path="/animals" element={<Animal />} />
            </Route>

            <Route element={<RequireAuth allowRight={ROUTE_RIGHT.report} />}>
                <Route path="/contribute" element={<Contribute />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
};

export default AppNavigation;