import React, { useEffect, useRef } from "react";
import Home from "./Home";
import Loading from "../components/Loading";
import { useImmer } from "use-immer";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { GET_REPORT } from "../config/AppConfig";
import { IReport, IReportStatus } from "../interface/AppInterface";
import TableData from "../components/TableData";
import { EyeOutlined } from "@ant-design/icons";
import ModalBasic, { IRefModalBasic } from "../components/ModalBasic";
import { STATUS_REPORT } from "../constants/AppConstant";
import { styles } from "../styles/style";
import ModalDetailReport from "../components/ModalDetailReport";

interface IState {
    loading: boolean;
    data: IReport[];
}

const Report = () => {
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
        formData.append('reportId', '');
        formData.append('status', '');
        const response = await axios.post(GET_REPORT, formData);
        console.log('response: ', response);
        setState(draft => {
            draft.loading = false;
            draft.data = response?.data || [];
        })
    }

    const onDetail = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: IReport) => {
        e.preventDefault();
        console.log('item: ', item);
        refModal?.current?.onOpen(
            'Chi tiết báo cáo',
            <ModalDetailReport
                item={item}
                onRefresh={loadData}
            />
        )
    }

    const renderActions = (row: IReport) => {
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

    const renderStatus = (row: IReportStatus) => {
        const status = STATUS_REPORT?.[row];

        return (
            <div className='flex flex-row items-center justify-start'>
                <div className={`w-28 h-11 flex items-center justify-center rounded-md border-double border-4 border-[${status.color}]`}>
                    <span className={`${styles.textNoramal} text-[${status.color}]`}>{status.title}</span>
                </div>
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
                        title: 'Tiêu đề',
                        dataIndex: 'title',
                        key: 'title',
                    },
                    {
                        title: 'Mô tả',
                        dataIndex: 'description',
                        key: 'description',
                    },
                    {
                        title: 'Trạng thái',
                        dataIndex: 'action',
                        key: 'action',
                        width: '15%',
                        render: renderStatus
                    },
                    {
                        title: 'Thời gian',
                        dataIndex: 'report_time',
                        key: 'report_time',
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
                    <h1 className="text-3xl font-extrabold">Báo cáo</h1>
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

export default Report;