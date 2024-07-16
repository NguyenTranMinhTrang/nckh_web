import React, { useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import Loading from "./Loading";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { GET_ANIMAL } from "../config/AppConfig";
import { IAnimal } from "../interface/AppInterface";
import IDDropdown from "./IDDropdown";
import { styles } from "../styles/style";

interface ModalPickAnimalState {
    loading: boolean;
    data: IAnimal[];
}

interface ModalPickAnimalProps {
    onClose: () => void;
    onSave: (id: string) => void;
}

const ModalPickAnimal = (props: ModalPickAnimalProps) => {
    const { onClose } = props;
    const axios = useAxiosPrivate();

    const [state, setState] = useImmer<ModalPickAnimalState>({
        loading: true,
        data: []
    })

    const animalChoose = useRef('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const formData = new FormData();
        const response = await axios.post(GET_ANIMAL, formData);
        if (response?.data?.resultCode === 0) {
            setState(draft => {
                draft.loading = false;
                draft.data = response?.data?.data || [];
            })
        } else {
            setState(draft => {
                draft.loading = false;
            })
        }
    }

    if (state.loading) {
        return (
            <div className="p-5 h-60 overflow-y-scroll flex items-center justify-center">
                <Loading showProps />
            </div>
        )
    }

    const onChange = (key: string) => {
        animalChoose.current = key;
    }

    const onSave = () => {
        onClose();
        props?.onSave?.(animalChoose.current);
    }

    const renderSelcted = (item: IAnimal) => {
        return (
            <div className={`w-full h-11 px-4 flex items-center justify-start rounded-md border-double border-4`}>
                <span className={`${styles.textNoramal} overflow-hidden `}>{item.vn_name}</span>
            </div>
        )
    }

    return (
        <div>
            <div className="py-4">
                <IDDropdown
                    items={state.data}
                    keyLabel="vn_name"
                    keyValue="animal_red_list_id"
                    renderItemSelected={renderSelcted}
                    onChange={onChange}
                />
            </div>

            <div className="flex items-center justify-end p-2 border-t border-solid border-slate-200 rounded-b">
                <button
                    className="bg-error text-white active:opacity-90 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150 mr-5"
                    type="button"
                    onClick={onClose}>
                    Hủy
                </button>
                <button
                    className="bg-primary text-white active:opacity-90 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150 mr-5"
                    type="button"
                    onClick={onSave}>
                    OK
                </button>
            </div>

        </div>
    )
}

export default ModalPickAnimal;