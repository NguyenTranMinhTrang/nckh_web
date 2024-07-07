import React from "react";
import { Controller } from "react-hook-form";
import IDDropdown, { IPropDropdown } from "./IDDropdown";

interface IProps extends IPropDropdown {
    name: string;
    control: any;
}

const IDDropdownField = (props: IProps) => {
    const { control, name, ...resProps } = props;
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const { onChange, value } = field;
                return (
                    <IDDropdown
                        {...resProps}
                        defaultValue={value}
                        onChange={onChange}
                    />
                )
            }}
        />
    )
}

export default IDDropdownField;