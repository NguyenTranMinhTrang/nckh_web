import React from "react";
import { logo } from "../constants/images";
import { styles } from "../styles/style";

const Logo = () => {
    return (
        <div className="flex items-center justify-center py-5 flex-row">
            <img
                src={logo}
                className="h-[50px] w-[50px] mr-3"
            />
            <span className={`${styles.titleText}`}>R.A.P</span>
        </div>
    )
}

export default Logo;