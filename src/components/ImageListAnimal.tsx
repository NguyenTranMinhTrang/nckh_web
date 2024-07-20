import React from "react";
import { toast } from "react-toastify";
import { Button, Upload } from "antd";
import { DeleteFilled, UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { UseFormGetValues, UseFormSetValue, useFieldArray } from "react-hook-form";
import { ImageLocal } from "../interface/AppInterface";

interface ImageListAnimalProps {
    name: string;
    control: any;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
}

const ImageListAnimal = (props: ImageListAnimalProps) => {

    const { control, name } = props;

    const { fields, append, remove } = useFieldArray({
        control,
        name: name,
    });

    const convertToBase64 = (img: RcFile, callback: (result: string | ArrayBuffer | null) => void) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    const beforeUpload = (file: RcFile) => {

        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

        if (!isJpgOrPng) {
            toast.error("Bạn chỉ có thể upload JPG/PNG file");
        }

        convertToBase64(file, (result) => {
            if (result) {
                append({
                    base64: result,
                    lastModified: file?.lastModified,
                    name: file?.name,
                    lastModifiedDate: file?.lastModified,
                    size: file?.size,
                    type: file?.type
                })
            }
        })
        return false;
    }

    const onDelete = (index: number) => () => {
        remove(index);
    }

    const renderHeader = () => {
        return (
            <div className="flex flex-row items-center justify-between mb-3">

                <div className="flex flex-row items-center">
                    <label className="text-[16px] font-poppins font-semibold">Hình ảnh</label>
                    <label className="text-[16px] font-poppins font-semibold text-[red] ml-1">*</label>
                </div>

                <Upload
                    multiple
                    showUploadList={false}
                    beforeUpload={beforeUpload}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
            </div>
        )
    }

    return (
        <div className="mt-5 min-h-40">

            {renderHeader()}

            <div className="flex flex-row overflow-x-scroll">
                {
                    (fields as unknown as ImageLocal[])?.map((img: ImageLocal, index: number) => {
                        return (
                            <div className="flex flex-row items-start mr-4" key={`${img.uid}-${index}`}>
                                <img
                                    className="h-44 w-44 rounded-3xl mr-3"
                                    src={img.base64}
                                />

                                <button
                                    className="w-7 h-7 bg-red-600 rounded-md mr-2 hover:opacity-90"
                                    onClick={onDelete(index)}>
                                    <DeleteFilled style={{ color: "white", fontSize: 13 }} />
                                </button>
                            </div>
                        )
                    })

                }
            </div>
        </div>
    )
}

export default ImageListAnimal;