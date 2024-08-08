import React, { forwardRef, useImperativeHandle } from "react";
import { useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { IAnimal, IAnimalType, IConversationStatus } from "../interface/AppInterface";
import Loading, { IRefLoading } from "./Loading";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { GET_ANIMAL, GET_CONVERSATION_STATUS, GTE_ANIMAL_TYPE, UPDATE_ANIMAL } from "../config/AppConfig";
import { styles } from "../styles/style";
import IDDropdownField from "./IDDropdownField";
import InputField from "./InputField";
import ImageListAnimalUpdate, { ImageItem } from "./ImageListAnimalUpdate";
import { RcFile } from "antd/es/upload";
import { useAppSelector } from "../redux/store";

interface IProps {
    id: number;
    type?: 'detail' | 'edit';
    onRefresh: () => void;
    onClose: () => void;
}

interface IState {
    loading: boolean;
    data: IAnimal | null;
    animalType: IAnimalType[];
    status: IConversationStatus[];
}

export interface IRefModalDetailAnimal {
    onSave: () => void;
}

interface ValueForm extends Omit<IAnimal, 'animal_type' | 'conservation_status'> {
    ls_delete: number[];
}

const ModalDetailAnimal = forwardRef<IRefModalDetailAnimal, IProps>((props, ref) => {
    const { id, type = 'detail', onClose } = props;
    const axios = useAxiosPrivate();
    const refLoading = useRef<IRefLoading>(null);
    const [state, setState] = useImmer<IState>({
        loading: true,
        data: null,
        animalType: [],
        status: []
    })

    const auth = useAppSelector(st => st?.user?.auth);

    const readOnly = type === 'detail';

    const { control, handleSubmit, register, formState: { errors }, reset, getValues, setValue } = useForm<ValueForm>({
        mode: 'all',
        defaultValues: {
            ls_delete: []
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

        if (resAnimal?.data?.resultCode === 0 && resType?.data?.resultCode === 0 || resStatus?.data?.resultCode === 0) {
            const dataAnimal: IAnimal = resAnimal?.data?.data;
            const { animal_type, conservation_status, ...resValue } = dataAnimal;
            console.log('animal_type: ', animal_type);
            console.log('conservation_status: ', conservation_status);
            reset(resValue);
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

    const onSubmit: SubmitHandler<ValueForm> = async (data: ValueForm) => {
        const { images, ls_delete, ...resValue } = data;

        const formData = new FormData();
        for (const [key, value] of Object.entries(resValue)) {
            formData.append(key, `${value}`);
        }

        images.forEach((val: ImageItem) => {
            if (!val?.image_id) {
                formData.append('images', val?.file as RcFile);
            }
        })

        if (ls_delete && ls_delete.length > 0) {
            formData.append('images_delete', ls_delete.join('-'));
        }

        refLoading?.current?.onOpen();

        const response = await axios.post(UPDATE_ANIMAL, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        if (response?.data?.resultCode === 0) {
            onClose();
            props?.onRefresh?.();
            toast.success("Thao tác thành công !")
        } else {
            toast.error(response?.data?.message || "Thao tác thất bại! Vui lòng thử lại !");
        }

        refLoading?.current?.onClose();
    }

    const renderImage = () => {
        return (
            <ImageListAnimalUpdate
                readOnly={readOnly}
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
                            disabled={readOnly}
                            required={true}
                            //@ts-expect-error: right type
                            errors={errors}
                            name={'vn_name'}
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
                                readOnly={readOnly}
                                name="animal_type_id"
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
                                readOnly={readOnly}
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
                            disabled={readOnly}
                            required={true}
                            //@ts-expect-error: right type
                            errors={errors}
                            name={'sc_name'}
                            title={'Tên khoa học'}
                            //@ts-expect-error: right type
                            register={register}
                        />
                    </div>
                    <div className="flex flex-1">
                        <div className="flex-1">
                            <InputField
                                disabled={readOnly}
                                required={true}
                                //@ts-expect-error: right type
                                errors={errors}
                                name={'en_name'}
                                title={'Tên tiếng anh'}
                                //@ts-expect-error: right type
                                register={register}
                            />
                        </div>

                        {
                            auth?.role_id === 1 &&
                            <div className="flex-1 ml-3">
                                <InputField
                                    disabled={readOnly}
                                    required={true}
                                    //@ts-expect-error: right type
                                    errors={errors}
                                    name={'predict_id'}
                                    title={'Thứ tự dự đoán'}
                                    //@ts-expect-error: right type
                                    register={register}
                                    validate={(value: string) => {
                                        if (/^[0-9\b]+$/.test(value)) {
                                            return undefined;
                                        }
                                        return "Vui lòng nhập một số nguyên !";
                                    }}
                                />
                            </div>
                        }
                    </div>
                </div>

                <div className="mt-3">
                    <InputField
                        disabled={readOnly}
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
                    {renderImage()}
                </div>
            </div>

            <div className="flex items-center justify-end p-2 border-t border-solid border-slate-200 rounded-b">
                <button
                    className="bg-error text-white active:opacity-90 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150 mr-5"
                    type="button"
                    onClick={onClose}>
                    Đóng
                </button>

                {
                    !readOnly &&
                    <button
                        className="bg-primary text-white active:opacity-90 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150 mr-5"
                        type="button"
                        onClick={onSave}>
                        Lưu
                    </button>
                }

            </div>

            <Loading ref={refLoading} style="bg-transparent" />
        </div>
    )
})

ModalDetailAnimal.displayName = 'ModalDetailAnimal';

export default ModalDetailAnimal;