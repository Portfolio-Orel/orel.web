import { useEffect } from 'react';
import { signInAnonymously } from "firebase/auth";
import { init, auth } from '../firebase.config';
import { useDispatch, useSelector } from 'react-redux';

export default function Auth() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        if (user) return;
        init();
        signInAnonymously(auth).then((userCredential) => {
            const user = userCredential.user;
            dispatch({ type: 'SET_USER', payload: { user } });
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
    }, []);
};