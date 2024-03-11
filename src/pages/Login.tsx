import React, { useRef } from "react";
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

interface IFormValues {
    userName: string;
    password: string;
}

const Login = () => {
    const axios = useAxiosPrivate();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<IFormValues>({
        mode: 'all',
        defaultValues: {
            userName: 'rap_admin',
            password: 'user2024'
        },
    });

    const loadingRef = useRef<IRefLoading>(null);

    const handleLogin = async (values: IFormValues) => {
        console.log('values: ', values);
        loadingRef?.current?.onOpen();
        const formData = new FormData();
        formData.append('userName', values?.userName);
        formData.append('password', values?.password);

        const response: IResponse = await axios.post(LOGIN, formData);
        console.log('response: ', response);

        if (response?.resultCode == 0) {
            console.log('response: ', response);
            const userData: IUserData = response?.data;
            dispatch(setUser(userData));
            await localStorage.setItem(STORAGE_KEY.USER_DATA, JSON.stringify(userData));
            navigate('/report', { replace: true });

        } else {
            toast.error(response?.message || 'Thao tác thất bại, xin vui lòng thử lại!');
        }
        loadingRef?.current?.onClose();
    }

    return (
        <div className="h-screen bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
            <div className="bg-white w-1/3 rounded-xl p-7">
                <h1 className={`text-4xl font-extrabold text-primary text-center`}>Đăng nhập</h1>
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
        </div>
    )
}

export default Login;