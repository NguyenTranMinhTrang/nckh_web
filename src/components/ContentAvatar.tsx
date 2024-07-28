import React from "react";
import { Upload } from "antd";
import { RcFile } from "antd/es/upload";

interface ContentAvatarProps {
    onChangeAvatar: (file: RcFile) => void;
    onChangeUser: () => void;
    onHide: () => void;
}

const ContentAvatar = (props: ContentAvatarProps) => {

    const { onChangeUser, onChangeAvatar, onHide } = props;

    const onClick = () => {
        onHide();
    }

    return (
        <div className="w-40">

            <Upload showUploadList={false} beforeUpload={onChangeAvatar}>
                <div onClick={onClick} className="h-10 w-40 rounded-md flex items-center px-2 hover:bg-[#F0F0F0] cursor-pointer">
                    <span>Cập nhập Avatar</span>
                </div>
            </Upload>


            <div onClick={onChangeUser} className="h-10 rounded-md flex items-center px-2 hover:bg-[#F0F0F0] cursor-pointer">
                <span>Thông tin người dùng</span>
            </div>
        </div>
    )
}

export default ContentAvatar;