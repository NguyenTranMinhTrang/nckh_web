import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import RequireAuth from "./pages/RequireAuth";
import { ROUTE_RIGHT } from "./constants/AppConstant";
import UnAuthorized from "./pages/UnAuthorized";
import Report from "./pages/Report";

const AppNavigation = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<UnAuthorized />} />

            {/* Private path */}
            <Route element={<RequireAuth allowRight={ROUTE_RIGHT.report} />}>
                <Route path="/report" element={<Report />} />
            </Route>
        </Routes>
    )
};

export default AppNavigation;