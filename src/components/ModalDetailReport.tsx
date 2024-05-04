import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { IReport, IResponse, IStatusReport } from "../interface/AppInterface";
import { styles } from "../styles/style";
import { COLOR_ERROR, COLOR_PRIMARY, KEY_API_GOOGLE_MAP, STATUS_REPORT_OPTIONS } from "../constants/AppConstant";
import IDDropdown from "./IDDropdown";
import Loading, { IRefLoading } from "./Loading";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { UPDATE_STATUS_REPORT } from "../config/AppConfig";
import axiosCustom from 'axios';
//@ts-expect-error: kkk
import GoogleMapReact from 'google-map-react';
import { useImmer } from "use-immer";
import { CreditCardOutlined, PhoneOutlined } from "@ant-design/icons";

interface IProps {
    item: IReport;
    onRefresh: () => void;
    onClose: () => void;
}

interface IState {
    loading: boolean;
    address: string;
}

const Marker = (props: any) => {
    console.log('props: ', props);
    return <img src={require('../constants/images/location-pin.png')} className="h-4 w-4" />
}

const ModalDetailReport = (props: IProps) => {
    const { item, onRefresh, onClose } = props;
    const axios = useAxiosPrivate();
    const refLoading = useRef<IRefLoading>(null);
    const [state, setState] = useImmer<IState>({
        loading: true,
        address: ''
    })

    useEffect(() => {
        getAddress();
    }, []);

    const getAddress = async () => {
        const response = await axiosCustom.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${item.lat},${item.lng}&key=${KEY_API_GOOGLE_MAP}`, {
            withCredentials: false,
        });

        console.log('getAddress: ', response);

        if (response?.data?.status === 'OK') {
            setState(draft => {
                draft.loading = false;
                draft.address = response?.data?.results[0]?.formatted_address;
            })
        } else {
            setState(draft => {
                draft.loading = false;
                draft.address = '';
            })
        }
    }

    const onChange = async (keyValue: string) => {
        refLoading?.current?.onOpen();
        const formData = new FormData();
        //@ts-expect-error: abc
        formData.append('reportId', item?.report_id);
        formData.append('action', keyValue);
        const response: IResponse = await axios.post(UPDATE_STATUS_REPORT, formData);
        if (response?.data && response?.data?.resultCode === 0) {
            toast.success('Thao tác thành công !');
            onRefresh();
            onClose();
        } else {
            toast.error(response?.data?.message || "Thao tác thất bại! Vui lòng thử lại !");
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

    if (state.loading) {
        return (
            <div className="p-5 h-60 overflow-y-scroll flex items-center justify-center">
                <Loading showProps />
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
                <CreditCardOutlined style={{ color: COLOR_PRIMARY }} />
                <span className={styles.textNoramal}><span className="font-semibold"> Mô tả:</span> {item.description}</span>
            </div>

            <div className="my-2">
                <PhoneOutlined style={{ color: COLOR_ERROR }} />
                <span className={styles.textNoramal}> <span className="font-semibold">Số điện thoại:</span> {item.phone_number}</span>
            </div>

            <div className={styles.flexRow}>
                <div className="flex flex-col mr-12">
                    <h3 className="font-poppins font-semibold">Hình ảnh</h3>
                    <div className="h-60 w-56 rounded-md my-5">
                        <img src={item.image} className="w-full h-full rounded-md" alt="" />
                    </div>
                </div>

                <div className="flex flex-1 flex-col">
                    <h3 className="font-poppins font-semibold">Vị trí : {state.address}</h3>
                    <div className="h-60 w-100 rounded-md my-5">
                        <div style={{ height: '100%', width: '100%' }}>
                            <GoogleMapReact
                                bootstrapURLKeys={{ key: KEY_API_GOOGLE_MAP }}
                                defaultCenter={{
                                    lat: item.lat,
                                    lng: item.lng
                                }}
                                defaultZoom={11}>
                                <Marker lat={item.lat} lng={item.lng} />
                            </GoogleMapReact>
                        </div>
                    </div>
                </div>
            </div>

            <Loading ref={refLoading} />
        </div>
    )
}

export default ModalDetailReport;