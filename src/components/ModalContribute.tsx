import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { toast } from "react-toastify";
import Loading from "./Loading";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { IAnimalImage, IContribute, IStatusReport } from "../interface/AppInterface";
import { GET_CONTRIBUTE } from "../config/AppConfig";
import { useForm } from "react-hook-form";
import InputField from "./InputField";
import IDDropdownField from "./IDDropdownField";
import { STATUS_CONTRIBUTE } from "../constants/AppConstant";
import { styles } from "../styles/style";
import ContributeImageField from "./ContributeImageField";

interface IProps {
    id: number;
    onClose: () => void;
}

interface IState {
    loading: boolean;
    data?: IContribute;
}

interface Image extends IAnimalImage {
    ticked: boolean;
}

interface FormValue extends Omit<IContribute, 'images'> {
    images: Image[];
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

    const { control, register, formState: { errors }, reset } = useForm<FormValue>({
        mode: 'all',
        defaultValues: {},
    })

    const loadData = async () => {
        const formData = new FormData();
        formData.append('contributeId', `${id}`);
        const response = await axios.post(GET_CONTRIBUTE, formData);
        if (response?.data && response?.data?.resultCode === 0) {

            const detail: IContribute = response?.data?.data?.[0];

            const images: Image[] = detail?.images?.map((val) => {
                return {
                    ...val,
                    ticked: val?.status === "OK"
                }
            })

            reset({
                ...detail,
                images
            })

            setState(draft => {
                draft.loading = false;
                draft.data = detail;
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

    const renderStatusSelected = (item: IStatusReport) => {
        return (
            <div className={`w-28 h-11 flex items-center justify-center rounded-md border-double border-4 border-${item.color}`}>
                <span className={`${styles.textNoramal} text-${item.color}`}>{item.lable}</span>
            </div>
        )
    }

    return (
        <div className="p-5 h-70 overflow-y-scroll">
            <div className="flex items-start mb-3">
                <div className="flex flex-1 mr-3">
                    <InputField
                        disabled
                        required={true}
                        //@ts-expect-error: right type
                        errors={errors}
                        name={'full_name'}
                        title={'Tên người đóng góp'}
                        //@ts-expect-error: right type
                        register={register}
                    />
                </div>

                <div className="flex flex-1 flex-row">
                    <InputField
                        disabled
                        required={true}
                        //@ts-expect-error: right type
                        errors={errors}
                        name={'phone_number'}
                        title={'Số điện thoại'}
                        //@ts-expect-error: right type
                        register={register}
                    />
                </div>
            </div>

            <div className="flex items-start">
                <div className="flex flex-1 mr-3">
                    <InputField
                        disabled
                        required={true}
                        //@ts-expect-error: right type
                        errors={errors}
                        name={'animal_name'}
                        title={'Tên động vật đóng góp'}
                        //@ts-expect-error: right type
                        register={register}
                    />
                </div>

                <div className="flex flex-1 flex-col ml-3">
                    <div className="flex flex-row items-center mb-3">
                        <label className="text-[16px] font-poppins font-semibold">Trạng thái</label>
                        <label className="text-[16px] font-poppins font-semibold text-[red] ml-1">*</label>
                    </div>
                    <IDDropdownField
                        readOnly
                        name="status"
                        control={control}
                        keyLabel="lable"
                        keyValue="value"
                        items={STATUS_CONTRIBUTE}
                        renderItemSelected={renderStatusSelected}
                    />
                </div>
            </div>

            <div className="mt-3">
                <div className="flex flex-row items-center mb-3">
                    <label className="text-[16px] font-poppins font-semibold">Hình ảnh</label>
                    <label className="text-[16px] font-poppins font-semibold text-[red] ml-1">*</label>
                </div>

                <ContributeImageField
                    name="images"
                    control={control}
                />
            </div>
        </div>
    )
}

export default ModalContribute;