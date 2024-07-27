import React from "react";
import { useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import { SubmitHandler, useForm } from "react-hook-form";
import { IAnimal, IAnimalType, IConversationStatus, ImageLocal } from "../interface/AppInterface";
import Loading, { IRefLoading } from "./Loading";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { ADD_ANIMAL, GET_ANIMAL, GET_CONVERSATION_STATUS, GTE_ANIMAL_TYPE } from "../config/AppConfig";
import { styles } from "../styles/style";
import IDDropdownField from "./IDDropdownField";
import InputField from "./InputField";
import ImageListAnimal from "./ImageListAnimal";
import { toast } from "react-toastify";

interface IProps {
    id?: number;
    onDone: (id: number) => void;
    onClose: () => void;
}

interface IState {
    loading: boolean;
    maxPredict: number;
    data: IAnimal | null;
    animalType: IAnimalType[];
    status: IConversationStatus[];
}

interface IFormValue {
    animalTypeId: string;
    conservation_status_id: string;
    VNName: string;
    ENName: string;
    SCName: string;
    animalInfor: string;
    images: ImageLocal[];
}

const ModalCreateAnimal = (props: IProps) => {
    const { onClose } = props;
    const axios = useAxiosPrivate();
    const refLoading = useRef<IRefLoading>(null);
    const [state, setState] = useImmer<IState>({
        loading: true,
        data: null,
        animalType: [],
        status: [],
        maxPredict: 0
    })

    const { control, handleSubmit, register, getValues, setValue, formState: { errors } } = useForm<IFormValue>({
        mode: 'all',
        defaultValues: {
            VNName: '',
            ENName: '',
            SCName: '',
            animalInfor: '',
            images: []
        },
    })

    useEffect(() => {
        loadInitData();
    }, []);

    const onSave = () => {
        handleSubmit(onSubmit)();
    }

    const loadInitData = async () => {
        const formDataType = new FormData();
        formDataType.append('animalTypeId', '');
        const formDataStatus = new FormData();
        formDataStatus.append('conservationStatusId', '');

        const [resAnimal, resType, resStatus] = await Promise.all([
            axios.post(GET_ANIMAL, new FormData()),
            axios.post(GTE_ANIMAL_TYPE, formDataType),
            axios.post(GET_CONVERSATION_STATUS, formDataStatus)
        ])

        if (resAnimal?.data?.resultCode === 0 || resType?.data?.resultCode === 0 || resStatus?.data?.resultCode === 0) {

            let maxPredict = 0;

            const listAnimal: IAnimal[] = resAnimal?.data?.data || [];

            listAnimal.forEach((animal) => {
                if (animal?.predict_id > maxPredict) {
                    maxPredict = animal.predict_id;
                }
            })

            setState(draft => {
                draft.loading = false;
                draft.maxPredict = maxPredict + 1;
                draft.animalType = resType?.data?.data || [];
                draft.status = resStatus?.data?.data || [];
            })
        } else {
            setState(draft => {
                draft.loading = false;
            })
        }
    }

    const onSubmit: SubmitHandler<IFormValue> = async (data: IFormValue) => {
        if (data?.images?.length === 0) {
            toast.error('Bạn phải cung cấp ảnh của động vật');
            return;
        }

        const { images, ...resValue } = data;

        const formData = new FormData();

        for (const [key, value] of Object.entries(resValue)) {
            formData.append(key, value);
        }

        images.forEach((val) => {
            formData.append('images', val?.file);
        })

        formData.append('predictID', `${state.maxPredict}`)

        refLoading?.current?.onOpen();

        const response = await axios.post(ADD_ANIMAL, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        if (response?.data?.resultCode === 0) {
            props?.onDone?.(response?.data?.data?.animal_red_list_id);
        } else {
            toast.error(response?.data?.message || "Thao tác thất bại! Vui lòng thử lại !");
        }

        refLoading?.current?.onClose();

    }

    const renderImage = () => {
        return (
            <ImageListAnimal
                name="images"
                control={control}
                getValues={getValues}
                setValue={setValue}
            />
        )
    }

    const renderItemSelected = (item: IAnimalType) => {
        return (
            <div className={`w-60 h-11 flex items-center justify-center rounded-md border-double border-4`}>
                <span className={`${styles.textNoramal} overflow-hidden`}>{item.type_name}</span>
            </div>
        )
    }

    const renderStatusSelected = (item: IConversationStatus) => {
        return (
            <div className={`w-60 h-11 flex items-center justify-center rounded-md border-double border-4`}>
                <span className={`${styles.textNoramal} overflow-hidden`}>{item.status_name}</span>
            </div>
        )
    }

    if (state.loading) {
        return (
            <div className="p-5 min-h-80 flex items-center justify-center">
                <Loading showProps={true} style="bg-transparent" />
            </div>
        )
    }

    return (
        <div>
            <div className="p-5 min-h-80 max-h-96 overflow-y-scroll">
                <div className="flex items-start">
                    <div className="flex flex-1 mr-3">
                        <InputField
                            required={true}
                            //@ts-expect-error: right type
                            errors={errors}
                            name={'VNName'}
                            title={'Tên Việt'}
                            //@ts-expect-error: right type
                            register={register}
                        />
                    </div>
                    <div className="flex flex-1 flex-row">
                        <div>
                            <div className="flex flex-row items-center mb-3">
                                <label className="text-[16px] font-poppins font-semibold">Loại</label>
                                <label className="text-[16px] font-poppins font-semibold text-[red] ml-1">*</label>
                            </div>
                            <IDDropdownField
                                name="animalTypeId"
                                control={control}
                                keyLabel="type_name"
                                keyValue="animal_type_id"
                                items={state?.animalType}
                                renderItemSelected={renderItemSelected}
                            />
                        </div>

                        <div className="ml-3">
                            <div className="flex flex-row items-center mb-3">
                                <label className="text-[16px] font-poppins font-semibold">Tình trạng bảo tồn</label>
                                <label className="text-[16px] font-poppins font-semibold text-[red] ml-1">*</label>
                            </div>
                            <IDDropdownField
                                name="conservationStatusID"
                                control={control}
                                keyLabel="status_name"
                                keyValue="conservation_status_id"
                                items={state?.status}
                                renderItemSelected={renderStatusSelected}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-start mt-3">
                    <div className="flex flex-1 mr-3">
                        <InputField
                            required={true}
                            //@ts-expect-error: right type
                            errors={errors}
                            name={'ENName'}
                            title={'Tên tiếng anh'}
                            //@ts-expect-error: right type
                            register={register}
                        />
                    </div>
                    <div className="flex flex-1 flex-col">
                        <InputField
                            required={true}
                            //@ts-expect-error: right type
                            errors={errors}
                            name={'SCName'}
                            title={'Tên khoa học'}
                            //@ts-expect-error: right type
                            register={register}
                        />
                    </div>
                </div>

                <div className="mt-3">
                    <InputField
                        required={true}
                        //@ts-expect-error: right type
                        errors={errors}
                        name={'animalInfor'}
                        title={'Mô tả'}
                        //@ts-expect-error: right type
                        register={register}
                    />
                </div>

                {renderImage()}

            </div>
            <div className="flex items-center justify-end p-2 border-t border-solid border-slate-200 rounded-b">
                <button
                    className="bg-error text-white active:opacity-90 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150 mr-5"
                    type="button"
                    onClick={onClose}>
                    Đóng
                </button>
                <button
                    className="bg-primary text-white active:opacity-90 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150 mr-5"
                    type="button"
                    onClick={onSave}>
                    Lưu
                </button>
            </div>
            <Loading ref={refLoading} style="bg-transparent" />
        </div>
    )
}

ModalCreateAnimal.displayName = 'ModalCreateAnimal';

export default ModalCreateAnimal;