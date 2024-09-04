import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "../components/InputField";
import { styles } from "../styles/style";
import Loading, { IRefLoading } from "../components/Loading";
import InputPassword from "../components/InputPassword";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { LOGIN } from "../config/AppConfig";
import { IResponse, IUserData } from "../interface/AppInterface";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/reducers/userSlice";
import { useNavigate } from "react-router-dom";
import { STORAGE_KEY } from "../constants/AppConstant";
import { notSupport } from "../constants/images";

interface IFormValues {
    userName: string;
    password: string;
}

const Login = () => {
    const axios = useAxiosPrivate();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isSupport, setIsSupport] = useState(true);

    const { register, handleSubmit, formState: { errors } } = useForm<IFormValues>({
        mode: 'all',
        defaultValues: {
            userName: '',
            password: ''
        },
    });

    useEffect(() => {
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        window.addEventListener("load", handleCheckLogin);
        return () => window.removeEventListener("load", handleCheckLogin);
    });

    useEffect(() => {
        window.addEventListener("load", handleResize);
        return () => window.removeEventListener("load", handleResize);
    });

    const handleResize = () => {
        if (window.innerWidth < 1024 && isSupport) {
            setIsSupport(false)
        } else {
            setIsSupport(true)
        }
    }

    const handleCheckLogin = () => {
        const userInfor = localStorage.getItem(STORAGE_KEY.USER_DATA);
        if(userInfor != null) {
            navigate("/");
        }
    }

    const loadingRef = useRef<IRefLoading>(null);

    const handleLogin = async (values: IFormValues) => {
        loadingRef?.current?.onOpen();
        const formData = new FormData();
        formData.append('userName', values?.userName);
        formData.append('password', values?.password);

        const response: IResponse = await axios.post(LOGIN, formData);

        if (response?.data && response?.data?.resultCode === 0) {
            const userData: IUserData = response?.data?.data;
            dispatch(setUser(userData));
            await localStorage.setItem(STORAGE_KEY.USER_DATA, JSON.stringify(userData));
            navigate('/report', { replace: true });

        } else {
            toast.error(response?.message || 'Thao tác thất bại, xin vui lòng thử lại!');
        }
        loadingRef?.current?.onClose();
    }

    const renderBody = () => {
        if (!isSupport) {
            return (
                <div className="flex flex-1 flex-col h-96 items-center justify-center">
                    <img src={notSupport} className="h-52 w-52 mb-4" />
                    <span className={`${styles.textNoramal} text-center text-[red]`}>Không hổ trợ xem trên màn hình bé hơn 1024px</span>

                </div>
            )
        }

        return (
            <div>
                <h1 className={`text-4xl font-extrabold text-primary text-center`}>Welcome back</h1>
                <div className="my-4">
                    <form>
                        <InputField
                            required
                            //@ts-expect-error: right type
                            errors={errors}
                            name={'userName'}
                            title={'Tên đăng nhập'}
                            //@ts-expect-error: right type
                            register={register}
                        />

                        <InputPassword
                            required
                            //@ts-expect-error: right type
                            errors={errors}
                            name={'password'}
                            title="Mật khẩu"
                            //@ts-expect-error: right type
                            register={register}
                        />

                        <div
                            className="relative cursor-pointer flex justify-center items-center w-full h-11 rounded-sm bg-primary mt-8"
                            onClick={handleSubmit(handleLogin)}>
                            <span className={`${styles.textNoramal} text-[white]`}>
                                Đăng nhập
                            </span>
                            <Loading ref={loadingRef} />
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
            <div className="bg-white w-1/3 rounded-xl p-7">
                {renderBody()}
            </div>
        </div>
    )
}

export default Login;