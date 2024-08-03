import React from "react";
import { useNavigate } from "react-router-dom";
import { unauthorized } from "../constants/images";
import { getDataFromLocal, saveToLocal } from "../utils/localStorage";
import { STORAGE_KEY } from "../constants/AppConstant";
import { styles } from "../styles/style";

const UnAuthorized = () => {
    const previousPath = getDataFromLocal(STORAGE_KEY.PREVIOUS_PATH);
    const navigate = useNavigate();

    console.log();


    const handleGoback = () => {
        navigate(-1);
        saveToLocal(STORAGE_KEY.PREVIOUS_PATH, previousPath);
    }

    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <img src={unauthorized} alt="UnAuthorized" className="w-1/2 h-1/2 object-contain" />
            <span className={`${styles.textNoramal} text-[red]`}>Bạn không có quyền truy cập trang này !</span>
            <div
                className={`${styles.buttonBasic} mt-3`}
                onClick={handleGoback}>
                <span>Quay trở lại</span>
            </div>
        </div>
    )
}

export default UnAuthorized;