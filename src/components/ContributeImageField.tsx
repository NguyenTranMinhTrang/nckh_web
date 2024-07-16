import React from "react";
import { Controller, UseFormGetValues, UseFormSetValue, useFieldArray } from "react-hook-form";
import { Checkbox } from "antd";
import { Image } from "./ModalContribute";

interface ContributeImageFieldProps {
    name: string;
    control: any;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
}

const ContributeImageField = (props: ContributeImageFieldProps) => {
    const { name, control, setValue, getValues } = props;

    const { fields } = useFieldArray({
        control,
        name: name,
    });

    return (
        <div className="flex flex-row overflow-x-scroll">
            {
                (fields as unknown as Image[])?.map((img: Image, index: number) => {

                    return (
                        <div key={img.image_id} className="flex flex-row items-start mr-5 ">
                            <img
                                className="h-44 w-44 rounded-3xl mr-3"
                                src={img.image_public_path}
                            />
                            <Controller
                                name={`${name}.${index}.ticked`}
                                control={control}
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <Checkbox
                                            name=""
                                            checked={value}
                                            onChange={(e) => {
                                                if (!e.target.checked) {

                                                    const currentList: Image[] = getValues()?.[name] || [];
                                                    const find = (currentList as unknown as Image[]).find((val: Image) => {
                                                        return val?.ticked && val?.image_id !== img.image_id;
                                                    });

                                                    if (find) {
                                                        setValue('hasAnyTick', true);
                                                    } else {
                                                        setValue('hasAnyTick', false);

                                                    }
                                                } else {
                                                    setValue('hasAnyTick', true);
                                                }

                                                onChange(e.target.checked);
                                            }}
                                        />
                                    )
                                }}
                            />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ContributeImageField;