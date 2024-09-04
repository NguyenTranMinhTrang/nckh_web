import React from "react";
import { notSupport } from "../constants/images";
import { styles } from "../styles/style";

const NotSupport = () => {
    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <img src={notSupport} alt="UnAuthorized" className="w-1/2 h-1/2 object-contain mb-5" />
            <span className={`${styles.textNoramal} text-center text-[red]`}>Không hỗ trợ xem trên màn hình bé hơn 1024px !</span>
        </div>
    )
}

export default NotSupport;