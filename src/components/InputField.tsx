import React from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { Control, Controller, FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form";

interface IProps {
    disabled: boolean;
    title: string;
    type: 'text' | 'date';
    name: string;
    errors: Record<string, { type: string, message: string }>;
    register: UseFormRegister<FieldValues>;
    setValue?: UseFormSetValue<any>
    style?: string;
    required: boolean;
    validate?: (value: any) => undefined | string;
    control?: Control<any, any>;
}

const InputField = (props: IProps) => {
    const {
        disabled = false,
        errors,
        name,
        register,
        setValue,
        title,
        type,
        style,
        required = false,
        validate,
        control
    } = props;

    const onChangeDate = (date: Date) => {
        //@ts-expect-error: abc
        const dateObject = new Date(dayjs(date));
        //@ts-expect-error: abc
        setValue(name, dateObject);
    }

    const renderInput = () => {
        if (type === 'date') {
            return (
                <Controller
                    name={name}
                    control={control}
                    rules={{
                        required: required ? 'Trường thông tin không được để trống !' : undefined,
                        validate: validate
                    }}
                    render={({ field }) => {
                        return (
                            <div className="relative">
                                <DatePicker
                                    defaultValue={field?.value}
                                    className="border-2 shadow appearance-none rounded-md w-full py-2.5 px-3 mt-3 font-poppins leading-tight focus:outline-none focus:border-primary"
                                    onChange={onChangeDate}
                                    format={"DD/MM/YYYY"}
                                    picker={'date'}
                                    inputReadOnly={true}
                                    allowClear={false}
                                />
                            </div>
                        )
                    }}
                />

            );
        }

        return (
            <input
                {...register(name, {
                    required: required ? 'Trường thông tin không được để trống !' : undefined,
                    validate: validate
                })}
                disabled={disabled}
                type={type}
                placeholder={'Nhập ...'}
                className="border-2 shadow appearance-none rounded-md w-full mt-3 py-2.5 px-3 font-poppins leading-tight focus:outline-none focus:border-primary"
            />
        )
    }

    return (
        <div className={`w-full ${style}`}>
            {
                required ?
                    <div className="flex flex-row items-center">
                        <label className="text-[16px] font-poppins font-semibold">{title}</label>
                        <label className="text-[16px] font-poppins font-semibold text-[red] ml-1">*</label>
                    </div>
                    :
                    <label className="text-[16px] font-poppins font-semibold">{title}</label>
            }
            {
                renderInput()
            }
            {errors && errors[name] && <p className="text-[red] mt-1">* {errors[name].message}</p>}
        </div>
    );
}


export default InputField;
