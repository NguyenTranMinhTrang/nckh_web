import React from "react";
import { Layout, Menu, Modal } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { UnorderedListOutlined, LogoutOutlined, TwitterOutlined, UserOutlined } from "@ant-design/icons";
import Logo from "./Logo";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { LOGOUT } from "../config/AppConfig";
import { STORAGE_KEY } from "../constants/AppConstant";

const { Sider } = Layout;

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [modal, contextHolder] = Modal.useModal();
    const axios = useAxiosPrivate();

    const onLogout = async () => {
        const formData = new FormData();
        const response = await axios.post(LOGOUT, formData);
        console.log('response: ', response);
        if (response?.data && response?.data?.resultCode === 0) {
            localStorage.removeItem(STORAGE_KEY.USER_DATA);
            navigate('/login');
        }

    }

    const onClick = ({ key }: { key: string }) => {
        if (key === '/logout') {
            modal.confirm({
                title: 'Thông báo',
                content: 'Bạn có muốn đăng xuất ?',
                cancelText: 'Hủy',
                okText: 'OK',
                okButtonProps: {
                    style: { color: 'black', border: 0.5 }
                },
                onOk: onLogout
            })
        } else {
            if (key) {
                navigate(key);
            }
        }
    }

    return (
        <Sider theme="light" className="h-screen flex flex-col" width={250}>
            <Logo />
            <Menu
                selectedKeys={[location.pathname]}
                onClick={onClick}>
                <Menu.Item key="/report" icon={<UnorderedListOutlined />}>
                    Báo cáo
                </Menu.Item>

                <Menu.Item key="/animals" icon={<TwitterOutlined />}>
                    Quản lý động vật
                </Menu.Item>

                <Menu.Item key="/user" icon={<UserOutlined />}>
                    Quản lý người dùng
                </Menu.Item>

                <Menu.Item key="/logout" icon={<LogoutOutlined />}>
                    Đăng xuất
                </Menu.Item>
            </Menu>
            <div>{contextHolder}</div>;
        </Sider>
    )
}

export default SideBar;