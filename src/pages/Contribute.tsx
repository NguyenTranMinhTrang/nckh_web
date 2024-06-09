import React, { useEffect, useRef } from "react";
import { IContribute } from "../interface/AppInterface";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { useImmer } from "use-immer";
import ModalBasic, { IRefModalBasic } from "../components/ModalBasic";
import Home from "./Home";
import TableData from "../components/TableData";
import Loading from "../components/Loading";
import { GET_CONTRIBUTE } from "../config/AppConfig";
import { toast } from "react-toastify";
import { EyeOutlined } from "@ant-design/icons";
import ModalContribute from "../components/ModalContribute";

interface IState {
    loading: boolean;
    data: IContribute[];
}

const Contribute = () => {
    const axios = useAxiosPrivate();
    const [state, setState] = useImmer<IState>({
        loading: true,
        data: []
    })

    const refModal = useRef<IRefModalBasic>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const formData = new FormData();
        formData.append('contributeId', '');
        const response = await axios.post(GET_CONTRIBUTE, formData);
        if (response?.data && response?.data?.resultCode === 0) {
            setState(draft => {
                draft.loading = false;
                draft.data = response?.data?.data || [];
            })
        } else {
            setState(draft => {
                draft.loading = false;
                draft.data = [];
            })
            toast.error("Thao tác thất bại! Vui lòng thử lại !");
        }
    }

    const onClose = () => {
        refModal?.current?.onClose();
    }

    const onDetail = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: IContribute) => {
        e.preventDefault();
        refModal?.current?.onOpen(
            'Chi tiết đóng góp',
            <ModalContribute
                id={item.contribute_id}
                onClose={onClose}
            />
        )
    }

    const renderActions = (row: IContribute) => {
        return (
            <div className='flex flex-row items-center justify-center'>
                <button
                    className="w-9 h-9 bg-[#2666FA] rounded-lg mr-2 hover:opacity-90"
                    onClick={(e) => onDetail(e, row)}>
                    <EyeOutlined style={{ color: "white" }} />
                </button>
            </div>
        )
    }

    const renderBody = () => {
        if (state.loading) {
            return (
                <Loading showProps={true} style="bg-transparent" />
            )
        }

        return (
            <TableData
                columns={[
                    {
                        title: 'Tên động vật',
                        dataIndex: 'animal_name',
                        key: 'animal_name',
                    },
                    {
                        title: 'Tình trạng bảo tồn',
                        dataIndex: 'status',
                        key: 'status',
                    },
                    {
                        title: 'Tên người đóng góp',
                        dataIndex: 'full_name',
                        key: 'full_name',
                    },
                    {
                        title: 'Số điện thoại',
                        dataIndex: 'phone_number',
                        key: 'phone_number',
                    },
                    {
                        title: 'Hành động',
                        key: 'operation',
                        fixed: 'right',
                        render: renderActions,
                        align: 'right',
                        width: '10%',
                    }
                ]}
                data={state.data}
                sort={true}
            />
        )
    }

    return (
        <Home>
            <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-row">
                    <h1 className="text-3xl font-extrabold">Đóng góp</h1>
                </div>

                {/* Table */}
                <div className="mt-6 flex flex-1 relative overflow-y-scroll">
                    {renderBody()}
                </div>
                <ModalBasic ref={refModal} />
            </div>
        </Home>
    )
}

export default Contribute;