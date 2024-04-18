import { useEffect } from "react";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { REFRESH_TOKEN } from "../config/AppConfig";
// import { IResponse } from "../interface/AppInterface";
import { STORAGE_KEY } from "../constants/AppConstant";
import { useAppSelector } from "../redux/store";
// import { setUser } from "../redux/reducers/userSlice";
// import { useDispatch } from "react-redux";

const useAxiosPrivate = () => {
    const navigate = useNavigate();
    // const dispatch = useDispatch();
    const userData = useAppSelector(st => st.user.auth);

    const handleOutRefresh = () => {
        localStorage.removeItem(STORAGE_KEY.USER_DATA);
        toast.error('Đã hết phiên đăng nhập, vui lòng đăng nhập lại !');
        navigate('/login');
    }

    // const onRefresh = async () => {
    //     try {
    //         const response: IResponse = await axios.post(REFRESH_TOKEN, {}, {
    //             headers: {
    //                 Authorization: `${userData?.accessToken}`,
    //             }
    //         });

    //         console.log('response onRefresh: ', response);


    //         if (response?.resultCode === 0) {
    //             return response?.data?.newToken;
    //         } else {
    //             return '';
    //         }
    //     } catch (error) {
    //         return '';
    //     }
    // }

    useEffect(() => {
        console.log('Come in useRequest: ', userData);

        const requestIntercept = axios.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `${userData?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        )

        const responseIntercept = axios.interceptors.response.use(
            (response) => {
                console.log('response in interceptors: ', response);
                return response;
            },
            async (error) => {
                if (error?.request?.status === 403) {
                    handleOutRefresh();
                    // const prevRequest = error?.config;
                    // try {
                    //     const resToken = await onRefresh();
                    //     if (resToken) {
                    //         const newData = {
                    //             ...userData,
                    //             accessToken: resToken
                    //         }
                    //         dispatch(setUser(newData));
                    //         localStorage.setItem(STORAGE_KEY.USER_DATA, JSON.stringify(newData));
                    //         prevRequest.headers['Authorization'] = `${resToken}`;
                    //         return axios(prevRequest);
                    //     } else {
                    //         handleOutRefresh();
                    //     }
                    // } catch (error) {
                    //     handleOutRefresh();
                    // }
                }
                return;
            }
        )

        return () => {
            axios.interceptors.response.eject(responseIntercept);
            axios.interceptors.request.eject(requestIntercept);
        }
    }, [userData]);
    return axios;
};

export default useAxiosPrivate;
