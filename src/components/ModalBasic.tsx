import React, { forwardRef, useImperativeHandle } from "react";

interface IProps {
    type?: 'information' | 'basic';
}

export interface IRefModalBasic {
    onOpen: (header: string, content: JSX.Element) => void;
    onClose: () => void;
}

const ModalBasic = forwardRef<IRefModalBasic, IProps>((props, ref) => {
    const { type = 'basic' } = props;
    const [showModal, setShowModal] = React.useState(false);
    const [body, setBody] = React.useState<JSX.Element | null>(null);
    const [title, setTitle] = React.useState('');

    const onOpen = (header: string, content: JSX.Element) => {
        setShowModal(true);
        setBody(content);
        setTitle(header);
    }

    const onClose = () => {
        setShowModal(false);
    }

    useImperativeHandle(ref, () => {
        return {
            onOpen,
            onClose,
        }
    })


    const renderFooter = () => {
        if (type === 'information') {
            return (
                <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                >
                    Đóng
                </button>
            )
        }

        return (
            <>
                <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                >
                    Đóng
                </button>
                <button
                    className="bg-primary text-white active:opacity-90 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                >
                    Lưu
                </button>
            </>
        );
    }

    return (
        <>
            {
                showModal ?
                    <>
                        <div
                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        >
                            <div className="relative w-3/4 h-1/2 my-6 mx-auto">
                                {/*content*/}
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    {/*header*/}
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                        <h3 className="text-2xl font-semibold">
                                            {title}
                                        </h3>
                                        <button
                                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                            onClick={() => setShowModal(false)}
                                        >
                                            <span className="bg-transparent text-black opacity-5 h-6 w-6 text-lg block outline-none focus:outline-none">
                                                ×
                                            </span>
                                        </button>
                                    </div>
                                    {/*body*/}
                                    <div className="relative px-4 py-2 flex-auto">
                                        {body}
                                    </div>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-2 border-t border-solid border-slate-200 rounded-b">
                                        {renderFooter()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                    :
                    null
            }

        </>
    );
});

ModalBasic.displayName = 'ModalBasic';

export default ModalBasic;