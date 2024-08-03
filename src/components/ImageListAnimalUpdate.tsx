import React from "react";
import { toast } from "react-toastify";
import { Button, Upload } from "antd";
import { DeleteFilled, UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { UseFormGetValues, UseFormSetValue, useFieldArray } from "react-hook-form";
import { IAnimalImage, ImageLocal } from "../interface/AppInterface";

interface ImageListAnimalUpdateProps {
    name: string;
    control: any;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
}

export interface ImageItem extends Partial<IAnimalImage>, Partial<ImageLocal> { }

const ImageListAnimalUpdate = (props: ImageListAnimalUpdateProps) => {

    const { control, name, getValues, setValue } = props;

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
                    file
                })
            }
        })
        return false;
    }

    const onDelete = (index: number, img: ImageItem) => () => {
        if (img?.image_id) {
            const listDelete: number[] = getValues()?.ls_delete || [];
            listDelete.push(img.image_id);
            setValue('ls_delete', listDelete);
        }

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

            <div className="flex flex-row overflow-x-scroll mt-5">
                {
                    (fields as unknown as ImageItem[])?.map((img: ImageItem, index: number) => {

                        return (
                            <div className="flex flex-row w-72 items-start mr-3" key={`${index}`}>
                                <div className="h-44 w-44 rounded-3xl mr-3">
                                    <img
                                        className="h-full w-full rounded-3xl"
                                        src={img?.base64 || img?.image_public_path}
                                    />

                                </div>
                                <button
                                    className="w-7 h-7 bg-red-600 rounded-md hover:opacity-90"
                                    onClick={onDelete(index, img)}>
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

export default ImageListAnimalUpdate;