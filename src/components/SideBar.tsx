import React from "react";
import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import Logo from "./Logo";

const { Sider } = Layout;

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const onClick = ({ key }: { key: string }) => {
        if (key) {
            navigate(key);
        }
    }

    return (
        <Sider theme="light" className="h-screen" width={250}>
            <Logo />
            <Menu
                selectedKeys={[location.pathname]}
                onClick={onClick}>
                <Menu.Item key="/report" icon={<UnorderedListOutlined />}>
                    Báo cáo
                </Menu.Item>

                <Menu.Item key="/user" icon={<UserOutlined />}>
                    Quản lý người dùng
                </Menu.Item>
            </Menu>
        </Sider>
    )
}

export default SideBar;