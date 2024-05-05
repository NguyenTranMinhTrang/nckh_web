import React from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface IProps {
    disabled: boolean;
    title: string;
    type: 'text' | 'date';
    name: string;
    errors: Record<string, { type: string, message: string }>;
    register: UseFormRegister<FieldValues>;
    setValue?: (name: string, value: unknown, config?: any) => void;
    style?: string;
    required: boolean;
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
        required = false
    } = props;

    const onChange = (date: Date) => {
        //@ts-expect-error: abc
        const dateObject = new Date(dayjs(date));
        //@ts-expect-error: abc
        setValue(name, dateObject);
    }

    const renderInput = () => {
        if (type === 'date') {
            return (
                <div className="relative">
                    <DatePicker
                        className="border-2 shadow appearance-none rounded-md w-full py-2.5 px-3 font-poppins leading-tight focus:outline-none focus:border-primary"
                        onChange={onChange}
                        format={"DD/MM/YYYY"}
                        picker={'date'}
                        inputReadOnly={true}
                        allowClear={false}
                    />
                </div>
            );
        }

        return (
            <input
                {...register(name, {
                    required: required ? 'Trường thông tin không được để trống !' : undefined
                })}
                disabled={disabled}
                type={type}
                placeholder={`${title}...`}
                className="border-2 shadow appearance-none rounded-md w-full mt-3 py-2.5 px-3 font-poppins leading-tight focus:outline-none focus:border-primary"
            />
        )
    }

    return (
        <div className={`mt-8 w-full ${style}`}>
            <label className="text-[16px] font-poppins">{title}</label><br />
            {
                renderInput()
            }
            {errors && errors[name] && <p className="text-[red] mt-1">* {errors[name].message}</p>}
        </div>
    );
}


export default InputField;
