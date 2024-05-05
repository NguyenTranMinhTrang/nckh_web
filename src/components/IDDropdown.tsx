import React, { ReactNode, useEffect } from "react";
import { useImmer } from "use-immer";
import { Dropdown } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";

interface IState {
    items: ItemType[];
    selected: null | Record<string, any>;
}

export interface IPropDropdown {
    keyValue: string;
    keyLabel: string;
    items: any[];
    renderLabel?: ReactNode;
    renderItemSelected?: (item: any) => ReactNode;
    onChange?: (key: string) => void;
    defaultValue?: string;
}

const IDDropdown = (props: IPropDropdown) => {
    const { items, keyValue, defaultValue, keyLabel } = props;
    const [state, setState] = useImmer<IState>({
        items: [],
        selected: null
    })

    console.log('state: ', state);

    useEffect(() => {
        const menu: ItemType[] = items.map((item) => {
            const label = props?.renderLabel ? props.renderLabel : <div>{item?.[keyLabel] || ''}</div>;
            return {
                ...item,
                key: item?.[keyValue],
                label: (label)
            }
        })
        if (defaultValue) {
            const findItem = items.find(val => val?.[keyValue] === defaultValue);
            if (findItem) {
                setState(draft => {
                    draft.selected = findItem;
                    draft.items = menu;
                })
            }
        } else {
            setState(draft => {
                draft.items = menu;
            })
        }
    }, []);



    const renderValue = () => {
        if (!state.selected) {
            return (
                <div className={`w-32 h-11 flex items-center justify-center rounded-md border-double border-4`}>
                    <div>Chọn ...</div>
                </div>
            )
        }

        if (props?.renderItemSelected) {
            return props.renderItemSelected(state.selected);
        }

        return (
            <div>
                <span>{state?.selected?.[keyLabel] || ''}</span>
            </div>
        )
    }

    const onSelect = (item: any) => {
        console.log('item: ', item);
        const findItem = state?.items?.find(val => `${val?.key}` === `${item?.key}`);
        console.log('findItem: ', findItem);

        if (findItem) {
            setState(draft => {
                draft.selected = findItem;
            });
            props?.onChange?.(item?.key || '');
        }
    }

    return (
        <div>
            <Dropdown
                menu={{
                    items: state.items,
                    defaultValue: state.selected?.[keyValue] || '',
                    onClick: onSelect
                }}
                placement="bottom">
                {renderValue()}
            </Dropdown>
        </div>
    )
}

export default IDDropdown;