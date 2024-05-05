import React, { forwardRef, useImperativeHandle } from "react";
import { useEffect, useRef } from "react";
import { IAnimal, IAnimalType } from "../interface/AppInterface";
import Loading, { IRefLoading } from "./Loading";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { useImmer } from "use-immer";
import { GET_ANIMAL, GTE_ANIMAL_TYPE } from "../config/AppConfig";
import { styles } from "../styles/style";
import { SubmitHandler, useForm } from "react-hook-form";
import IDDropdownField from "./IDDropdownField";

interface IProps {
    id: number;
    onRefresh: () => void;
    onClose: () => void;
}

interface IState {
    loading: boolean;
    data: IAnimal | null;
    animalType: IAnimalType[];
}

interface IFormValue {
    animalTypeId: string;
}

export interface IRefModalDetailAnimal {
    onSave: () => void;
}

const ModalDetailAnimal = forwardRef<IRefModalDetailAnimal, IProps>((props, ref) => {
    const { id } = props;
    const axios = useAxiosPrivate();
    const refLoading = useRef<IRefLoading>(null);
    const [state, setState] = useImmer<IState>({
        loading: true,
        data: null,
        animalType: []
    })

    const { control, handleSubmit } = useForm<IFormValue>({
        defaultValues: {

        },
    })

    useEffect(() => {
        loadData();
    }, []);

    const onSave = () => {
        console.log('Run ref');
        handleSubmit(onSubmit)();
    }

    useImperativeHandle(ref, () => ({
        onSave
    }))

    const loadData = async () => {
        const formData = new FormData();
        formData.append('animalRedListId', `${id}`);
        const formDataType = new FormData();
        formDataType.append('animalTypeId', '');
        const [resAnimal, resType] = await Promise.all([
            axios.post(GET_ANIMAL, formData),
            axios.post(GTE_ANIMAL_TYPE, formDataType)
        ])

        console.log('resAnimal: ', resAnimal);
        console.log('resType: ', resType);

        if (resAnimal?.data?.resultCode === 0 && resType?.data?.resultCode === 0) {
            setState(draft => {
                draft.loading = false;
                draft.data = resAnimal?.data?.data;
                draft.animalType = resType?.data?.data || [];
            })
        } else {
            setState(draft => {
                draft.loading = false;
            })
        }
    }

    const onSubmit: SubmitHandler<IFormValue> = (data: IFormValue) => {
        console.log('onSubmit: ', data);
    }

    const renderItemSelected = (item: IAnimalType) => {
        return (
            <div className={`w-60 h-11 flex items-center justify-center rounded-md border-double border-4`}>
                <span className={`${styles.textNoramal} overflow-hidden`}>{item.type_name}</span>
            </div>
        )
    }

    if (state.loading) {
        return (
            <div className="p-5 min-h-80 flex items-center justify-center">
                <Loading showProps={true} style="bg-transparent" />
            </div>
        )
    }

    return (
        <div className="p-5 min-h-80 overflow-y-scroll">
            <div className="flex items-center justify-between">
                <span className={styles.titleText}>{state.data?.vn_name || ''}</span>
                <IDDropdownField
                    name="animalTypeId"
                    control={control}
                    keyLabel="type_name"
                    keyValue="animal_type_id"
                    items={state?.animalType}
                    renderItemSelected={renderItemSelected}
                />
            </div>
            <Loading ref={refLoading} style="bg-transparent" />
        </div>
    )
})

ModalDetailAnimal.displayName = 'ModalDetailAnimal';

export default ModalDetailAnimal;