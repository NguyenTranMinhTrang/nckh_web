import React, { useEffect, useRef } from "react";
import Home from "./Home";
import { useImmer } from "use-immer";
import Loading from "../components/Loading";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { GET_ANIMAL } from "../config/AppConfig";
import { IAnimal } from "../interface/AppInterface";
import TableData from "../components/TableData";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import ModalBasic, { IRefModalBasic } from "../components/ModalBasic";
import ModalDetailAnimal, { IRefModalDetailAnimal } from "../components/ModalDetailAnimal";

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

    const refModal = useRef<IRefModalBasic>(null);
    const refModalAnimal = useRef<IRefModalDetailAnimal>(null);

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

    const onSave = () => {
        console.log('Come here');

        refModalAnimal?.current?.onSave();
    }

    const onDetail = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: IAnimal) => {
        e.preventDefault();
        console.log('item: ', item);
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

    const renderActions = (row: IAnimal) => {
        return (
            <div className='flex flex-row items-center justify-center'>
                <button
                    className="w-9 h-9 bg-[#2666FA] rounded-lg mr-2 hover:opacity-90"
                    onClick={(e) => onDetail(e, row)}>
                    <EyeOutlined style={{ color: "white" }} />
                </button>

                <button
                    className="w-9 h-9 bg-error rounded-lg mr-2 hover:opacity-90"
                    onClick={(e) => onDetail(e, row)}>
                    <DeleteOutlined style={{ color: "white" }} />
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
                        title: '',
                        key: 'operation',
                        fixed: 'right',
                        render: renderActions,
                        align: 'right',
                        width: '15%',
                    }
                ]}
            />
        )
    }

    return (
        <Home>
            <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-row">
                    <h1 className="text-3xl font-extrabold">Quản lý động vật</h1>
                </div>

                {/* Table */}
                <div className="mt-6 flex flex-1 relative overflow-y-scroll">
                    {renderBody()}
                </div>
                <ModalBasic onSave={onSave} ref={refModal} />
            </div>
        </Home>
    )
}

export default Animal;