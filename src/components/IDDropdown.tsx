import React, { ReactNode, useEffect } from "react";
import { useImmer } from "use-immer";
import { Dropdown } from "antd";
import { MenuItemType } from "antd/es/menu/interface";

interface IState {
    items: MenuItemType[];
    selected: null | Record<string, any>;
}

export interface IPropDropdown {
    readOnly?: boolean;
    keyValue: string;
    keyLabel: string;
    items: any[];
    renderLabel?: ReactNode;
    renderItemSelected?: (item: any) => ReactNode;
    onChange?: (key: string) => void;
    defaultValue?: string;
}

const IDDropdown = (props: IPropDropdown) => {
    const { items, keyValue, defaultValue, keyLabel, readOnly = false } = props;
    const [state, setState] = useImmer<IState>({
        items: [],
        selected: null
    })

    useEffect(() => {
        const menu: MenuItemType[] = items.map((item) => {
            const label = props?.renderLabel ? props.renderLabel : <div>{item?.[keyLabel] || ''}</div>;
            return {
                ...item,
                key: item?.[keyValue],
                label: (label)
            }
        })
        if (defaultValue) {
            const findItem = items.find(val => val?.[keyValue] === defaultValue);
            console.log('findItem: ', findItem, defaultValue);

            if (findItem) {
                setState(draft => {
                    draft.selected = findItem;
                    //@ts-expect-error: aaa
                    draft.items = menu;
                })
            }
        } else {
            setState(draft => {
                //@ts-expect-error: aaa
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
        const findItem = state?.items?.find(val => `${val?.key}` === `${item?.key}`);

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
                    disabled: readOnly,
                    style: { height: 200, overflowY: 'scroll' },
                    onClick: onSelect
                }}
                placement="bottom">
                {renderValue()}
            </Dropdown>
        </div>
    )
}

export default IDDropdown;