import React, { useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import { toast } from "react-toastify";
import { Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import Loading, { IRefLoading } from "./Loading";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { IAnimalImage, IContribute, Options } from "../interface/AppInterface";
import { GET_CONTRIBUTE, UPDATE_CONTRIBUTE } from "../config/AppConfig";
import InputField from "./InputField";
import IDDropdownField from "./IDDropdownField";
import { STATUS_CONTRIBUTE } from "../constants/AppConstant";
import { styles } from "../styles/style";
import ContributeImageField from "./ContributeImageField";
import ModalBasic, { IRefModalBasic } from "./ModalBasic";
import ModalPickAnimal from "./ModalPickAnimal";
import ModalCreateAnimal from "./ModalCreateAnimal";

interface IProps {
    id: number;
    onClose: () => void;
    onDone?: () => void;
}

interface IState {
    loading: boolean;
    data?: IContribute;
}

export interface Image extends IAnimalImage {
    ticked: boolean;
}

interface FormValue extends Omit<IContribute, 'images'> {
    images: Image[];
    hasAnyTick: boolean;
}

const ModalContribute = (props: IProps) => {
    const { id, onClose, onDone } = props;

    const axios = useAxiosPrivate();
    const [modal, contextHolder] = Modal.useModal();

    const refLoading = useRef<IRefLoading>(null);
    const refModal = useRef<IRefModalBasic>(null);
    const refModalCreate = useRef<IRefModalBasic>(null);

    const [state, setState] = useImmer<IState>({
        loading: true,
    })

    useEffect(() => {
        loadData();
    }, []);

    const { control, register, setValue, getValues, formState: { errors }, reset } = useForm<FormValue>({
        mode: 'all',
        defaultValues: {},
    })

    const loadData = async () => {
        const formData = new FormData();
        formData.append('contributeId', `${id}`);
        const response = await axios.post(GET_CONTRIBUTE, formData);

        if (response?.data && response?.data?.resultCode === 0) {

            let hasAnyTick = false;

            const detail: IContribute = response?.data?.data?.[0];

            const images: Image[] = detail?.images?.map((val) => {

                if (val?.status === "OK") {
                    hasAnyTick = true;
                }

                return {
                    ...val,
                    ticked: val?.status === "OK"
                }
            })

            reset({
                ...detail,
                images,
                hasAnyTick
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

    const updateStatus = async (formData: FormData) => {
        refLoading?.current?.onOpen();

        const response = await axios.post(UPDATE_CONTRIBUTE, formData);

        if (response?.data && response?.data?.resultCode === 0) {
            toast.success("Thao tác thành công");
            onDone?.();
            onClose();
        } else {
            toast.error("Thao tác thất bại! Vui lòng thử lại !");
        }

        refLoading?.current?.onClose();
    }

    const onDonePickAnimal = (id: string) => {
        if (id) {
            const valueForm = getValues();
            const images = valueForm?.images?.filter((value) => value?.ticked)?.join('-') || '';
            const formData = new FormData();
            formData.append('status', 'OK');
            formData.append('contributeId', `${valueForm?.contribute_id}`);
            formData.append('lsImageAccept', images);
            formData.append('animalRedListID', id);

            updateStatus(formData);
        }
    }

    const onDoneCreate = (id: number) => {
        refModalCreate?.current?.onClose();
        if (id) {
            const valueForm = getValues();
            const images = valueForm?.images?.filter((value) => value?.ticked)?.join('-') || '';
            const formData = new FormData();
            formData.append('status', 'OK');
            formData.append('contributeId', `${valueForm?.contribute_id}`);
            formData.append('lsImageAccept', images);
            formData.append('animalRedListID', `${id}`);

            updateStatus(formData);
        }
    }

    const pickAnimal = () => {
        refModal?.current?.onOpen(
            'Chọn loài động vật',
            <ModalPickAnimal
                onClose={() => refModal?.current?.onClose()}
                onSave={onDonePickAnimal}
            />
        )
    }

    const createNewAnimal = () => {
        refModalCreate?.current?.onOpen(
            'Tạo mới động vật',
            <ModalCreateAnimal
                onClose={() => refModalCreate?.current?.onClose()}
                onDone={onDoneCreate}
            />,
        )
    }

    const updateForm = async (status: string) => {
        if (status === 'OK') {
            modal.confirm({
                title: 'Thông báo',
                content: 'Động vật đã có sẵn ?',
                cancelText: 'Không',
                okText: 'Có',
                okButtonProps: {
                    style: { color: 'black', border: 0.5 }
                },
                onOk: pickAnimal,
                onCancel: createNewAnimal
            })
        } else {
            const valueForm = getValues();
            const formData = new FormData();
            formData.append('status', status);
            formData.append('contributeId', `${valueForm?.contribute_id}`);
            formData.append('lsImageAccept', '');
            formData.append('animalRedListID', '');
            updateStatus(formData);
        }
    }

    const onSave = () => {
        updateForm('OK');
    }

    const onReject = () => {
        updateForm('XX');
    }

    if (state.loading) {
        return (
            <div className="p-5 h-60 overflow-y-scroll flex items-center justify-center">
                <Loading showProps />
            </div>
        )
    }

    const renderStatusSelected = (item: Options) => {
        return (
            <div className={`w-28 h-11 flex items-center justify-center rounded-md border-double border-4 border-${item.color}`}>
                <span className={`${styles.textNoramal} text-${item.color}`}>{item.label}</span>
            </div>
        )
    }

    return (
        <div>
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
                            keyLabel="label"
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
                        setValue={setValue}
                        getValues={getValues}
                    />
                </div>


            </div>

            <div className="flex items-center justify-end p-2 border-t border-solid border-slate-200 rounded-b">
                <button
                    className="bg-error text-white active:opacity-90 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150 mr-5"
                    type="button"
                    onClick={onClose}>
                    Đóng
                </button>
                <button
                    className="bg-error text-white active:opacity-90 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150 mr-5"
                    type="button"
                    onClick={onReject}>
                    Từ chối
                </button>

                <Controller
                    name={'hasAnyTick'}
                    control={control}
                    render={({ field }) => {
                        const { value } = field;

                        if (!value) {
                            return <></>
                        }

                        return (
                            <button
                                className="bg-primary text-white active:opacity-90 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={onSave}>
                                Chấp nhận
                            </button>
                        )
                    }}
                />

            </div>

            <div>{contextHolder}</div>;

            <Loading ref={refLoading} style="bg-transparent" />

            <ModalBasic
                ref={refModal}
                style="w-3/5"
                hideFooter
            />

            <ModalBasic
                ref={refModalCreate}
                hideFooter
            />

        </div>

    )
}

export default ModalContribute;