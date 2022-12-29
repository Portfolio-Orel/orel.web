import { useEffect } from 'react';
import { signInAnonymously } from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux';
import { init, auth } from '../firebase.config';

export default function Auth() {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.auth.user);

    useEffect(() => {
        if (currentUser) return;
        init();
        signInAnonymously(auth).then((userCredential) => {
            const response = userCredential.user;
            const user = {
                uid: response.uid,
            };
            dispatch({ type: 'SET_USER', payload: { user } });
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    });
};