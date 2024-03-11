import React from "react";
import SideBar from "../components/SideBar";

interface IProps {
    children: JSX.Element;
}

const Home = (props: IProps) => {
    return (
        <div className="h-screen flex flex-row">
            <SideBar />
            {/* Content */}
            <div className="flex flex-1">
                {props?.children}
            </div>
        </div>
    )
}

export default Home;