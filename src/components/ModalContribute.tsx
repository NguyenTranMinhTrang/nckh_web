import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { toast } from "react-toastify";
import Loading from "./Loading";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { IContribute } from "../interface/AppInterface";
import { GET_CONTRIBUTE } from "../config/AppConfig";

interface IProps {
    id: number;
    onClose: () => void;
}

interface IState {
    loading: boolean;
    data?: IContribute;
}

const ModalContribute = (props: IProps) => {
    const { id } = props;

    const axios = useAxiosPrivate();

    const [state, setState] = useImmer<IState>({
        loading: true,
    })

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const formData = new FormData();
        formData.append('contributeId', `${id}`);
        const response = await axios.post(GET_CONTRIBUTE, formData);
        if (response?.data && response?.data?.resultCode === 0) {
            setState(draft => {
                draft.loading = false;
                draft.data = response?.data?.data;
            })
        } else {
            setState(draft => {
                draft.loading = false;
            })
            toast.error("Thao tác thất bại! Vui lòng thử lại !");
        }
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


        </div>
    )
}

export default ModalContribute;