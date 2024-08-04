import React, { useEffect, useRef } from "react";
import { Modal, Switch } from "antd";
import { toast } from "react-toastify";
import { useImmer } from "use-immer";
import { PlusOutlined } from "@ant-design/icons";
import Home from "./Home";
import Loading, { IRefLoading } from "../components/Loading";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { GET_USER, UPDATE_STATUS_USER } from "../config/AppConfig";
import { IUser } from "../interface/AppInterface";
import TableData from "../components/TableData";
import ModalBasic, { IRefModalBasic } from "../components/ModalBasic";
import ModalCreateUser from "../components/ModalCreateUser";
import { useAppSelector } from "../redux/store";
import { checkRight } from "../utils/CommonUtil";
import { ROUTE_RIGHT } from "../constants/AppConstant";
import { unauthorized } from "../constants/images";
import { styles } from "../styles/style";

interface IState {
    loading: boolean;
    data: IUser[];
}

const User = () => {
    const axios = useAxiosPrivate();

    const [modal, contextHolder] = Modal.useModal();

    const auth = useAppSelector(st => st?.user?.auth);

    const CREATE_ACCOUNT = checkRight(auth?.role || [], ROUTE_RIGHT.createAccount);
    const GET_USER_LIST = checkRight(auth?.role || [], ROUTE_RIGHT.getUserList);

    const refLoading = useRef<IRefLoading>(null);
    const refModal = useRef<IRefModalBasic>(null);

    const [state, setState] = useImmer<IState>({
        loading: true,
        data: []
    })

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const formData = new FormData();
        const response = await axios.post(GET_USER, formData);
        if (response?.data?.resultCode === 0) {
            setState(draft => {
                draft.loading = false;
                draft.data = response?.data?.data || [];
            })
        } else {
            setState(draft => {
                draft.loading = false;
            })
        }
    }

    const onUpdateStatus = (status: string, item: IUser) => async () => {
        refLoading?.current?.onOpen();
        const formData = new FormData();
        formData.append('userId', `${item?.user_id}`);
        formData.append('status', status);
        const response = await axios.post(UPDATE_STATUS_USER, formData);
        if (response?.data?.resultCode === 0) {
            await loadData();
        } else {
            toast.error("Thao tác thất bại! Vui lòng thử lại !");
        }
        refLoading?.current?.onClose();
    }

    const onBlock = (item: IUser) => (checked: boolean) => {

        const title = checked ?
            "Bạn có chắc chắn muốn khóa tài khoản này ?"
            :
            "Bạn có chắc chắn muốn mở khóa tài khoản này";

        modal.confirm({
            title: 'Thông báo',
            content: title,
            cancelText: 'Hủy',
            okText: 'OK',
            okButtonProps: {
                style: { color: 'black', border: 0.5 }
            },
            onOk: onUpdateStatus(checked ? 'OK' : 'XX', item)
        })
    }

    const onClose = () => {
        refModal?.current?.onClose();
    }

    const onDone = () => {
        onClose();
        loadData();
    }

    const onCreateNewUser = () => {
        refModal?.current?.onOpen(
            'Tạo Mới Tài Khoản Admin',
            <ModalCreateUser
                onClose={onClose}
                onDone={onDone}
            />
        )
    }

    const renderActions = (row: IUser) => {
        return (
            <div className='flex flex-row items-center justify-center'>
                <Switch
                    checked={row?.status === 'OK'}
                    onChange={onBlock(row)}
                />
            </div>
        )
    }

    const renderBody = () => {
        if (state.loading) {
            return (
                <Loading showProps={true} style="bg-transparent" />
            )
        }

        if (!GET_USER_LIST) {
            return (
                <div className="flex flex-1 flex-col items-center justify-center">
                    <img src={unauthorized} alt="UnAuthorized" className="w-1/2 h-1/2 object-contain" />
                    <span className={`${styles.textNoramal} text-[red]`}>Bạn không có quyền truy cập chức năng này !</span>
                </div>
            )
        }

        return (
            <TableData
                data={state.data}
                sort={true}
                columns={[
                    {
                        title: 'Username',
                        dataIndex: 'user_name',
                        key: 'user_name',
                    },
                    {
                        title: 'Tên đầy đủ',
                        dataIndex: 'full_name',
                        key: 'full_name',
                    },
                    {
                        title: 'Email',
                        dataIndex: 'email',
                        key: 'email',
                    },
                    {
                        title: 'Số điện thoại',
                        dataIndex: 'phone_number',
                        key: 'phone_number',
                    },
                    {
                        title: 'Role',
                        dataIndex: 'role_name',
                        key: 'role_name',
                    },
                    {
                        title: 'Active',
                        key: 'operation',
                        fixed: 'right',
                        render: renderActions,
                        align: 'center',
                        width: '15%',
                    }
                ]}
            />
        )
    }

    return (
        <Home>
            <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-row items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold">Quản lý người dùng</h1>
                    </div>

                    {
                        CREATE_ACCOUNT &&
                        <button
                            className="px-4 h-9 bg-[#2666FA] flex items-center justify-center rounded-md hover:opacity-90"
                            onClick={onCreateNewUser}>
                            <h2 className="text-white mr-2">Tạo mới</h2>
                            <PlusOutlined style={{ color: "white" }} />
                        </button>
                    }
                </div>

                {/* Table */}
                <div className="mt-6 flex flex-1 relative overflow-y-scroll">
                    {renderBody()}
                </div>

                <div>{contextHolder}</div>;
                <Loading ref={refLoading} style="bg-transparent" />
                <ModalBasic
                    ref={refModal}
                    hideFooter
                />
            </div>
        </Home>
    )
}

export default User;