import React from "react";
// import { logo } from "../constants/images";
// import { styles } from "../styles/style";
import { useAppSelector } from "../redux/store";
import { styles } from "../styles/style";

const Logo = () => {
    const userData = useAppSelector(st => st.user.auth);

    return (
        <div className="flex items-center justify-center p-5 flex-row">
            <div className="h-[50px] w-[50px] rounded-[25px] flex items-center justify-center">
                <img src={userData?.avt} className="h-full w-full rounded-[25px]" alt="" />
            </div>

            <span className={`${styles.titleText} ml-2`}>{userData?.userName}</span>
            {/* <div className={styles.flexRow}>
                <img
                    src={logo}
                    className="h-[50px] w-[50px] mr-3"
                />
                <span className={`${styles.titleText}`}>R.A.P</span>
            </div> */}
        </div>
    )
}

export default Logo;