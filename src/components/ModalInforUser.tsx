import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../redux/store";
import { IUserData } from "../interface/AppInterface";
import InputField from "./InputField";
import dayjs, { Dayjs } from "dayjs";
import Loading, { IRefLoading } from "./Loading";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { UPDATE_PROFILE } from "../config/AppConfig";
import { setUser } from "../redux/reducers/userSlice";

interface ModalInforUserProps {
    type: 'detail' | 'update';
    onClose: () => void;
}

interface ValueForm extends Omit<IUserData, 'dayOfBirth'> {
    dayOfBirth?: Dayjs;
}

const ModalInforUser = (props: ModalInforUserProps) => {

    const { type, onClose } = props;

    const readOnly = type === 'detail';

    const userData = useAppSelector(st => st.user.auth);
    const axios = useAxiosPrivate();
    const dispatch = useDispatch();

    const refLoading = useRef<IRefLoading>(null);

    const { handleSubmit, control, register, formState: { errors }, setValue } = useForm<ValueForm>({
        mode: 'all',
        defaultValues: {
            ...userData,
            dayOfBirth: userData?.dayOfBirth ? dayjs(userData?.dayOfBirth, 'YYYY-MM-DD') : undefined
        },
    })

    const onSubmit = async (values: ValueForm) => {
        refLoading?.current?.onOpen();

        const { dayOfBirth, ...resValue } = values;

        const formData = new FormData();

        for (const [key, value] of Object.entries(resValue)) {
            formData.append(key, `${value}`);
        }

        if (dayOfBirth) {
            formData.append('dayOfBirth', dayjs(dayOfBirth).format('YYYY-MM-DD'));
        }

        const response = await axios.post(UPDATE_PROFILE, formData);

        if (response?.data?.resultCode === 0) {

            const newUser = {
                ...userData,
                ...response?.data?.data
            }

            dispatch(setUser(newUser));

            toast.success("Thao tác thành công");

            onClose();

        } else {
            toast.error(response?.data?.message || "Thao tác thất bại! Vui lòng thử lại !");
        }
        refLoading?.current?.onClose();
    }

    const onSave = () => {
        handleSubmit(onSubmit)();
    }

    const validateEmail = (value: string) => {
        if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            return "Email không hợp lệ !"
        }

        return undefined;
    }

    const validatePhone = (value: string) => {
        const re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        if (value && !re.test(value)) {
            return "Số điện thoại không hợp lệ"
        }

        return undefined;
    }

    return (
        <div>
            <div className="p-5 min-h-80 max-h-96 overflow-y-scroll">
                <div className="flex items-start">
                    <div className="flex flex-1 mr-3">
                        <InputField
                            disabled
                            required={true}
                            //@ts-expect-error: right type
                            errors={errors}
                            name={'userName'}
                            title={'Username'}
                            //@ts-expect-error: right type
                            register={register}
                        />
                    </div>

                    <div className="flex flex-1 mr-3">
                        <InputField
                            disabled
                            required={true}
                            //@ts-expect-error: right type
                            errors={errors}
                            name={'email'}
                            title={'Email'}
                            //@ts-expect-error: right type
                            register={register}
                            validate={validateEmail}

                        />
                    </div>
                </div>

                <div className="flex items-start mt-3">
                    <div className="flex flex-1 mr-3">
                        <InputField
                            disabled={readOnly}
                            required={true}
                            //@ts-expect-error: right type
                            errors={errors}
                            name={'fullName'}
                            title={'Tên '}
                            //@ts-expect-error: right type
                            register={register}
                        />
                    </div>

                    <div className="flex flex-1 flex-row">
                        <InputField
                            disabled={readOnly}
                            required={true}
                            //@ts-expect-error: right type
                            errors={errors}
                            name={'phoneNumber'}
                            title={'Số điện thoại'}
                            //@ts-expect-error: right type
                            register={register}
                            validate={validatePhone}
                        />
                    </div>
                </div>

                <div className="flex items-start mt-3">
                    <div className="flex flex-1 mr-3">
                        <InputField
                            disabled={readOnly}
                            required={true}
                            //@ts-expect-error: right type
                            errors={errors}
                            name={'dayOfBirth'}
                            title={'Ngày sinh'}
                            type="date"
                            //@ts-expect-error: right type
                            register={register}
                            control={control}
                            setValue={setValue}
                        />
                    </div>

                    <div className="flex flex-1 flex-row">

                    </div>
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

export default ModalInforUser;