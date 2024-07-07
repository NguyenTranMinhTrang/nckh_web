import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { IAnimalImage } from "../interface/AppInterface";
import { Checkbox } from "antd";

interface ContributeImageFieldProps {
    name: string;
    control: any;
}

const ContributeImageField = (props: ContributeImageFieldProps) => {
    const { name, control } = props;

    const { fields } = useFieldArray({
        control,
        name: name,
    });

    return (
        <div className="flex flex-row overflow-x-scroll">
            {
                (fields as unknown as IAnimalImage[])?.map((img: IAnimalImage, index: number) => {
                    console.log('img: ', img);

                    return (
                        <div key={img.image_id} className="flex flex-row items-start mr-5 ">
                            <img
                                className="h-44 w-44 rounded-3xl mr-3"
                                src={img.image_public_path}
                            />
                            <Controller
                                name={`${name}.${index}.`}
                                control={control}
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <Checkbox
                                            name=""
                                            checked={value}
                                            onChange={onChange}
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