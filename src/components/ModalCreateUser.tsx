import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import InputField from "./InputField";
import dayjs from "dayjs";
import Loading, { IRefLoading } from "./Loading";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { CREATE_USER } from "../config/AppConfig";
import { toast } from "react-toastify";

interface IFormValue {
    userName: string;
    email: string;
    dayOfBirth: Date;
    fullName: string;
    phoneNumber: number;
}

interface ModalCreateUserProps {
    onClose: () => void;
    onDone: () => void;
}

const ModalCreateUser = (props: ModalCreateUserProps) => {

    const { onClose, onDone } = props;

    const axios = useAxiosPrivate();

    const refLoading = useRef<IRefLoading>(null);

    const { control, handleSubmit, register, setValue, formState: { errors } } = useForm<IFormValue>({
        mode: 'all',
    })

    const onSubmit = async (values: IFormValue) => {
        refLoading?.current?.onOpen();

        const { dayOfBirth, ...resValue } = values;

        const formData = new FormData();

        for (const [key, value] of Object.entries(resValue)) {
            formData.append(key, `${value}`);
        }

        formData.append('dayOfBirth', dayjs(new Date(dayOfBirth)).format('YYYY-MM-DD'));

        const response = await axios.post(CREATE_USER, formData);

        if (response?.data?.resultCode === 0) {
            onDone();
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

                <InputField
                    required={true}
                    //@ts-expect-error: right type
                    errors={errors}
                    name={'fullName'}
                    title={'Họ và tên'}
                    //@ts-expect-error: right type
                    register={register}
                />

                <div className="flex items-start mt-3">
                    <div className="flex flex-1 mr-3">
                        <InputField
                            required={true}
                            //@ts-expect-error: right type
                            errors={errors}
                            name={'userName'}
                            title={'Username'}
                            //@ts-expect-error: right type
                            register={register}
                        />
                    </div>

                    <div className="flex flex-1 flex-row">
                        <InputField
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
                            required={true}
                            //@ts-expect-error: right type
                            errors={errors}
                            name={'dayOfBirth'}
                            title={'Ngày sinh'}
                            type="date"
                            //@ts-expect-error: right type
                            register={register}
                            setValue={setValue}
                            control={control}
                        />
                    </div>

                    <div className="flex flex-1 flex-row">
                        <InputField
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

export default ModalCreateUser;