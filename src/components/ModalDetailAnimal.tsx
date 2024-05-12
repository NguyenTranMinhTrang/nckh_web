import React, { forwardRef, useImperativeHandle } from "react";
import { useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import { SubmitHandler, useForm } from "react-hook-form";
import { IAnimal, IAnimalImage, IAnimalType, IConversationStatus } from "../interface/AppInterface";
import Loading, { IRefLoading } from "./Loading";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { GET_ANIMAL, GET_CONVERSATION_STATUS, GTE_ANIMAL_TYPE } from "../config/AppConfig";
import { styles } from "../styles/style";
import IDDropdownField from "./IDDropdownField";
import InputField from "./InputField";

interface IProps {
    id: number;
    onRefresh: () => void;
    onClose: () => void;
}

interface IState {
    loading: boolean;
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
    animal_infor: string;
}

export interface IRefModalDetailAnimal {
    onSave: () => void;
}

const ModalDetailAnimal = forwardRef<IRefModalDetailAnimal, IProps>((props, ref) => {
    const { id } = props;
    const axios = useAxiosPrivate();
    const refLoading = useRef<IRefLoading>(null);
    const [state, setState] = useImmer<IState>({
        loading: true,
        data: null,
        animalType: [],
        status: []
    })

    const { control, handleSubmit, register, formState: { errors }, reset } = useForm<IFormValue>({
        mode: 'all',
        defaultValues: {
            VNName: '',
            ENName: '',
            SCName: '',
            animal_infor: ''
        },
    })

    useEffect(() => {
        loadData();
    }, []);

    const onSave = () => {
        handleSubmit(onSubmit)();
    }

    useImperativeHandle(ref, () => ({
        onSave
    }))

    const loadData = async () => {
        const formData = new FormData();
        formData.append('animalRedListId', `${id}`);
        const formDataType = new FormData();
        formDataType.append('animalTypeId', '');
        const formDataStatus = new FormData();
        formDataStatus.append('conservationStatusId', '');
        const [resAnimal, resType, resStatus] = await Promise.all([
            axios.post(GET_ANIMAL, formData),
            axios.post(GTE_ANIMAL_TYPE, formDataType),
            axios.post(GET_CONVERSATION_STATUS, formDataStatus)
        ])

        console.log('resAnimal: ', resAnimal);
        console.log('resType: ', resType);
        console.log('resStatus: ', resStatus);

        if (resAnimal?.data?.resultCode === 0 && resType?.data?.resultCode === 0 || resStatus?.data?.resultCode === 0) {
            const dataAnimal: IAnimal = resAnimal?.data?.data;
            reset({
                VNName: dataAnimal?.vn_name,
                ENName: dataAnimal?.en_name,
                SCName: dataAnimal?.sc_name,
                animal_infor: dataAnimal?.animal_infor,
            })
            setState(draft => {
                draft.loading = false;
                draft.data = resAnimal?.data?.data;
                draft.animalType = resType?.data?.data || [];
                draft.status = resStatus?.data?.data || [];
            })
        } else {
            setState(draft => {
                draft.loading = false;
            })
        }
    }

    const onSubmit: SubmitHandler<IFormValue> = (data: IFormValue) => {
        console.log('onSubmit: ', data);
    }

    const renderImage = () => {
        return (
            <div className="flex flex-row">
                {
                    state?.data?.images?.map((img: IAnimalImage) => {
                        return (
                            <div key={img.image_id}>
                                <img
                                    className="h-44 w-44 rounded-3xl mr-3"
                                    src={img.image_public_path}
                                />
                            </div>
                        )
                    })
                }
            </div>
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
                            name="conservation_status_id"
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
                    name={'animal_infor'}
                    title={'Mô tả'}
                    //@ts-expect-error: right type
                    register={register}
                />
            </div>

            <div className="mt-3">
                <div className="flex flex-row items-center mb-3">
                    <label className="text-[16px] font-poppins font-semibold">Hình ảnh</label>
                    <label className="text-[16px] font-poppins font-semibold text-[red] ml-1">*</label>
                </div>

                {renderImage()}
            </div>

            <Loading ref={refLoading} style="bg-transparent" />
        </div>
    )
})

ModalDetailAnimal.displayName = 'ModalDetailAnimal';

export default ModalDetailAnimal;