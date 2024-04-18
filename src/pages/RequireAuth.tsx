import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { setUser } from "../redux/reducers/userSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../redux/store";
import { STORAGE_KEY } from "../constants/AppConstant";

interface IProps {
    allowRight: string;
}

const RequireAuth = (props: IProps) => {
    const { allowRight } = props;
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const userData = useAppSelector(state => state.user.auth);
    const location = useLocation();

    useEffect(() => {
        checkLogin();
    }, []);

    console.log('userData: ', userData);

    const checkLogin = async () => {
        console.log('Run check login');

        try {
            if (!userData) {
                const response = await localStorage.getItem(STORAGE_KEY.USER_DATA);
                console.log('response userData: ', response);
                if (response) {
                    const user = JSON.parse(response);
                    dispatch(setUser(user));
                }
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    if (loading) {
        return (
            <Loading showProps={true} />
        )
    }

    return (
        <div>
            {
                userData ?
                    (
                        userData?.role?.find(right => allowRight?.includes(right)) ?
                            <Outlet />
                            :
                            <Navigate to={'/unauthorized'} state={{ from: location }} replace />
                    )
                    :
                    <Navigate to={'/login'} state={{ from: location }} replace />
            }
        </div>
    );
}

export default RequireAuth;