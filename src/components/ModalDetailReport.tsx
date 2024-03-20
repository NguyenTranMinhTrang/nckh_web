import React, { useEffect, useRef } from "react";
import { IReport, IResponse, IStatusReport } from "../interface/AppInterface";
import { styles } from "../styles/style";
import { STATUS_REPORT_OPTIONS } from "../constants/AppConstant";
import { fromLatLng } from "react-geocode";
import IDDropdown from "./IDDropdown";
import Loading, { IRefLoading } from "./Loading";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { UPDATE_STATUS_REPORT } from "../config/AppConfig";
import { toast } from "react-toastify";

interface IProps {
    item: IReport;
    onRefresh: () => void;
}


const ModalDetailReport = (props: IProps) => {
    const { item, onRefresh } = props;
    const axios = useAxiosPrivate();
    const refLoading = useRef<IRefLoading>(null);

    useEffect(() => {
        getAddress();
    }, []);

    const getAddress = () => {
        fromLatLng(48.8583701, 2.2922926)
            .then(({ results }) => {
                const { lat, lng } = results[0].geometry.location;
                console.log(lat, lng);
            })
            .catch(console.error);
    }

    const onChange = async (keyValue: string) => {
        console.log('keyValue: ', keyValue);

        refLoading?.current?.onOpen();
        const formData = new FormData();
        //@ts-expect-error: abc
        formData.append('reportId', item?.report_id);
        formData.append('action', keyValue);

        const response: IResponse = await axios.post(UPDATE_STATUS_REPORT, formData);
        console.log('response: ', response);

        if (response) {
            toast.success('Thao tác thành công !');
            onRefresh();
        } else {
            toast.error("Thao tác thất bại! Vui lòng thử lại !");
        }
        refLoading?.current?.onClose();
    }

    const renderItemSelected = (item: IStatusReport) => {
        return (
            <div className={`w-28 h-11 flex items-center justify-center rounded-md border-double border-4 border-${item.color}`}>
                <span className={`${styles.textNoramal} text-${item.color}`}>{item.lable}</span>
            </div>
        )
    }

    return (
        <div className="p-5 h-70 overflow-y-scroll">
            <div className={`${styles.flexRow} justify-between`}>
                <span className={styles.titleText}>{item.title}</span>

                <IDDropdown
                    items={STATUS_REPORT_OPTIONS}
                    keyLabel="lable"
                    keyValue="value"
                    defaultValue={item.action}
                    renderItemSelected={renderItemSelected}
                    onChange={onChange}
                />
            </div>

            <div className="my-2">
                <span className={styles.textNoramal}>{item.description}</span>
            </div>

            <div className={styles.flexRow}>
                <div className="flex flex-1 flex-col">
                    <h3 className="font-poppins font-semibold">Hình ảnh</h3>
                    <div className="h-56 w-56 rounded-md my-5">
                        <img src={item.image} className="w-full h-full rounded-md" alt="" />
                    </div>
                </div>

                <div className="flex flex-1 flex-col">
                    <h3 className="font-poppins font-semibold">Vị trí</h3>
                    <div className="h-56 w-56 rounded-md my-5">
                        <img src={item.image} className="w-full h-full rounded-md" alt="" />
                    </div>
                </div>
            </div>

            <Loading ref={refLoading} />
        </div>
    )
}

export default ModalDetailReport;