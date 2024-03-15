import React from "react";
import { IReport } from "../interface/AppInterface";
import { styles } from "../styles/style";
import { STATUS_REPORT } from "../constants/AppConstant";

interface IProps {
    item: IReport;
}

const ModalDetailReport = (props: IProps) => {
    const { item } = props;
    const status = STATUS_REPORT[item.action];

    return (
        <div className="p-5 h-70 overflow-y-scroll">
            <div className={`${styles.flexRow} justify-between`}>
                <span className={styles.titleText}>{item.title}</span>
                <div className={`w-28 h-11 flex items-center justify-center rounded-md border-double border-4 border-${status.color}`}>
                    <span className={`${styles.textNoramal} text-${status.color}`}>{status.title}</span>
                </div>
            </div>

            <div className="my-2">
                <span className={styles.textNoramal}>{item.description}</span>
            </div>

            <div className={styles.flexRow}>
                <div className="flex flex-1 flex-col">
                    <h3 className="font-poppins font-semibold">Hình ảnh</h3>
                    <div className="h-56 w-56 rounded-md my-5">
                        <img src={item.image} className="w-full h-full rounded-md" alt="" />
                    </div>
                </div>

                <div className="flex flex-1 flex-col">
                    <h3 className="font-poppins font-semibold">Vị trí</h3>
                    <div className="h-56 w-56 rounded-md my-5">
                        <img src={item.image} className="w-full h-full rounded-md" alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalDetailReport;