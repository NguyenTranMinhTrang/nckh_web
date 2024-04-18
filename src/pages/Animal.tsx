import React from "react";
import Home from "./Home";

const Animal = () => {
    return (
        <Home>
            <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-row">
                    <h1 className="text-3xl font-extrabold">Quản lý động vật</h1>
                </div>

                {/* Table */}
                <div className="mt-6 flex flex-1 relative overflow-y-scroll">
                </div>
            </div>
        </Home>
    )
}

export default Animal;