import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Popover } from "antd";
import { useAppSelector } from "../redux/store";
import { styles } from "../styles/style";
import ContentAvatar from "./ContentAvatar";
import { RcFile } from "antd/es/upload";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { UPLOAD_AVATAR_USER } from "../config/AppConfig";
import Loading, { IRefLoading } from "./Loading";
import ModalBasic, { IRefModalBasic } from "./ModalBasic";
import ModalInforUser from "./ModalInforUser";
import { IUserData } from "../interface/AppInterface";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/reducers/userSlice";
import { STORAGE_KEY } from "../constants/AppConstant";

const Logo = () => {

    const userData = useAppSelector(st => st.user.auth);

    const [open, setOpen] = useState(false);

    const refLoading = useRef<IRefLoading>(null);
    const refModal = useRef<IRefModalBasic>(null);

    const axios = useAxiosPrivate();
    const dispatch = useDispatch();

    const onHide = () => {
        setOpen(false);
    }

    const onChangeAvatar = async (file: RcFile) => {
        refLoading?.current?.onOpen();

        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

        if (!isJpgOrPng) {
            toast.error("Bạn chỉ có thể upload JPG/PNG file");
        }

        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post(UPLOAD_AVATAR_USER, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });


        if (response?.data?.resultCode === 0) {
            const avatar: IUserData = {
                ...userData!,
                avt: response?.data?.data?.img
            }

            await localStorage.setItem(STORAGE_KEY.USER_DATA, JSON.stringify(avatar));
            dispatch(setUser(avatar));
            toast.success("Thao tác thành công");
        } else {
            toast.error(response?.data?.message || "Thao tác thất bại! Vui lòng thử lại !");
        }

        refLoading?.current?.onClose();

    }

    const handleOpenChange = (_open: boolean) => {
        console.log('Come here: ', _open);

        setOpen(_open);
    }

    const onClose = () => {
        refModal?.current?.onClose();
    }

    const onChangeUser = () => {
        onHide();

        refModal?.current?.onOpen(
            'Thông tin người dùng',
            <ModalInforUser
                type="update"
                onClose={onClose}
            />
        )
    }

    return (
        <>
            <Popover
                trigger={"click"}
                open={open}
                onOpenChange={handleOpenChange}
                content={<ContentAvatar onHide={onHide} onChangeAvatar={onChangeAvatar} onChangeUser={onChangeUser} />}>
                <div className="flex items-center justify-center p-5 flex-row cursor-pointer">
                    <div className="h-[50px] w-[50px] rounded-[25px] flex items-center justify-center">
                        <img src={userData?.avt} className="h-full w-full rounded-[25px]" alt="" />
                    </div>

                    <span className={`${styles.titleText} ml-2`}>{userData?.userName}</span>
                </div>


            </Popover>

            <ModalBasic ref={refModal} hideFooter />
            <Loading ref={refLoading} style="bg-transparent" />
        </>
    )
}

export default Logo;