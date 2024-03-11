import React, { useState } from "react";
import { eyeSlash, eye } from "../constants/images";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface IProps {
    title?: string;
    name: string,
    errors: Record<string, { type: string, message: string }>;
    register: UseFormRegister<FieldValues>;
    required?: boolean;
}

const InputPassword = (props: IProps) => {
    const {
        name,
        errors,
        register,
        title = 'Password',
        required = false
    } = props;
    const [show, setShow] = useState(false);

    const onClick = () => {
        setShow(!show);
    }

    return (
        <div className="mt-8">
            <label className="text-[16px] font-poppins">{title}</label><br />
            <div className="mt-3 flex flex-row relative items-center">
                <input
                    {...register(name, {
                        required: required ? 'Trường thông tin không được để trống !' : undefined
                    })}
                    type={show ? 'text' : 'password'}
                    placeholder={`${title}...`}
                    className="border-2 shadow appearance-none rounded-md w-full py-2.5 px-3 font-poppins leading-tight focus:outline-none focus:border-primary"
                />

                <img
                    src={show ? eye : eyeSlash}
                    alt="Eye"
                    className="w-[24px] h-[24px] absolute right-3 cursor-pointer"
                    onClick={onClick}
                />
            </div>
            {errors && errors[name] && <p className="text-[red] mt-1">* {errors[name].message}</p>}

        </div>
    );
}

export default InputPassword;