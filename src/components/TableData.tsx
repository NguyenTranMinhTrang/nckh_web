import React from "react";
import { Table } from "antd";
import { defaultSort } from "../utils/CommonUtil";

interface IProps {
    maxX?: number;
    maxY?: number;
    columns: any[],
    data: any[],
    sort: boolean
}

const TableData = (props: IProps) => {
    const {
        columns,
        data,
        sort,
        maxX,
    } = props;

    let sortColumns = null;

    if (sort) {
        sortColumns = columns.map((column) => {
            if (column.key === 'operation') {
                return column;
            }
            return {
                ...column,
                sorter: (a: any, b: any) => {
                    return defaultSort(a[column.dataIndex], b[column.dataIndex]);
                },
            }
        })
    }

    return (
        <Table
            columns={sortColumns || columns}
            dataSource={data}
            scroll={{ x: maxX || 1000, y: '100%' }}
            pagination={false}
            sticky
        />
    )
}

export default TableData;