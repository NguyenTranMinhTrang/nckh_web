import React, { useEffect, useRef } from "react";
import Home from "./Home";
import { useImmer } from "use-immer";
import Loading from "../components/Loading";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { GET_ANIMAL } from "../config/AppConfig";
import { IAnimal } from "../interface/AppInterface";
import TableData from "../components/TableData";
import { EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import ModalBasic, { IRefModalBasic } from "../components/ModalBasic";
import ModalDetailAnimal, { IRefModalDetailAnimal } from "../components/ModalDetailAnimal";
import ModalCreateAnimal from "../components/ModalCreateAnimal";
import { useAppSelector } from "../redux/store";
import { checkRight } from "../utils/CommonUtil";
import { ROUTE_RIGHT } from "../constants/AppConstant";
import { unauthorized } from "../constants/images";
import { styles } from "../styles/style";


interface IState {
    loading: boolean;
    data: IAnimal[];
}

const Animal = () => {
    const axios = useAxiosPrivate();
    const [state, setState] = useImmer<IState>({
        loading: true,
        data: []
    })

    const refModalAnimal = useRef<IRefModalDetailAnimal>(null);
    const refModal = useRef<IRefModalBasic>(null);

    const auth = useAppSelector(st => st?.user?.auth);

    const GET_ANIMAL_LIST = checkRight(auth?.role || [], ROUTE_RIGHT.getListAnimal);
    const CREATE_ANIMAL = checkRight(auth?.role || [], ROUTE_RIGHT.createAnimal);
    const UPDATE_ANIMAL = checkRight(auth?.role || [], ROUTE_RIGHT.updateAnimal);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const formData = new FormData();
        const response = await axios.post(GET_ANIMAL, formData);
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

    const onRefresh = () => {
        loadData();
    }

    const onDoneCreate = () => {
        refModal?.current?.onClose();
        loadData();
    }

    const onCreateAnimal = () => {
        refModal?.current?.onOpen(
            'Tạo mới động vật',
            <ModalCreateAnimal
                onClose={() => refModal?.current?.onClose()}
                onDone={onDoneCreate}
            />
        )
    }

    const onDetail = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: IAnimal) => {
        e.preventDefault();
        refModal?.current?.onOpen(
            'Chi tiết',
            <ModalDetailAnimal
                ref={refModalAnimal}
                id={item.animal_red_list_id}
                onClose={() => refModal?.current?.onClose()}
                onRefresh={onRefresh}
            />
        )
    }

    const onUpdate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: IAnimal) => {
        e.preventDefault();
        refModal?.current?.onOpen(
            'Chỉnh sửa',
            <ModalDetailAnimal
                ref={refModalAnimal}
                type="edit"
                id={item.animal_red_list_id}
                onClose={() => refModal?.current?.onClose()}
                onRefresh={onRefresh}
            />
        )
    }

    const renderActions = (row: IAnimal) => {
        return (
            <div className='flex flex-row items-center justify-center'>
                <button
                    className="w-9 h-9 bg-[#2666FA] rounded-lg mr-2 hover:opacity-90"
                    onClick={(e) => onDetail(e, row)}>
                    <EyeOutlined style={{ color: "white" }} />
                </button>

                {
                    UPDATE_ANIMAL &&
                    <button
                        className="w-9 h-9 bg-[#F4A52B] rounded-lg mr-2 hover:opacity-90"
                        onClick={(e) => onUpdate(e, row)}>
                        <EditOutlined style={{ color: "white" }} />
                    </button>
                }
            </div>
        )
    }

    const renderBody = () => {
        if (state.loading) {
            return (
                <Loading showProps={true} style="bg-transparent" />
            )
        }

        if (!GET_ANIMAL_LIST) {
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
                        title: 'Tên',
                        dataIndex: 'vn_name',
                        key: 'vn_name',
                    },
                    {
                        title: 'Tên khoa học',
                        dataIndex: 'sc_name',
                        key: 'sc_name',
                    },
                    {
                        title: 'Loại',
                        dataIndex: 'animal_type',
                        key: 'animal_type',
                    },
                    {
                        title: 'Tình trạng bảo tồn',
                        dataIndex: 'conservation_status',
                        key: 'conservation_status',
                    },
                    {
                        title: 'Hành động',
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
                <div className="flex flex-row justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold">Quản lý động vật</h1>
                    </div>

                    {
                        CREATE_ANIMAL &&
                        <button
                            className="px-4 h-9 bg-[#2666FA] flex items-center justify-center rounded-md hover:opacity-90"
                            onClick={onCreateAnimal}>
                            <h2 className="text-white mr-2">Tạo mới</h2>
                            <PlusOutlined style={{ color: "white" }} />
                        </button>
                    }
                </div>

                {/* Table */}
                <div className="mt-6 flex flex-1 relative overflow-y-scroll">
                    {renderBody()}
                </div>

                <ModalBasic
                    ref={refModal}
                    hideFooter
                />
            </div>
        </Home>
    )
}

export default Animal;