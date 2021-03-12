import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import AuthForm from '../../components/auth/AuthForm';
import { changeField, initializeForm, login } from '../../modules/auth';
import { check } from '../../modules/user';

const LoginForm=({history})=>{
    //컴포넌트를 리덕스와 연동
    const dispatch=useDispatch();
    const {form, auth, authError, user}=useSelector(({auth, user})=>({
        form:auth.login,
        auth: auth.auth,
        authError: auth.authError,
        user: user.user
    }));
    const [error, setError]=useState(null);

    const onChange=e=>{
        const {value, name}=e.target;
        dispatch(changeField({
            form:'login',
            key: name,
            value 
        }));
    };

    const onSubmit=e=>{
        e.preventDefault();
        const {username, password}=form;
        dispatch(login({username, password}));
    };
    //로그인 페이지에서 값 입력후 다른 페이지 이동시 폼 초기화
    useEffect(()=>{
        dispatch(initializeForm('login'));
    }, [dispatch]);

    useEffect(()=>{
        if(authError){
            console.log('에러발생');
            console.log(authError);
            setError('로그인 실패!');
        }
        if(auth){
            console.log('로그인 성공!');
            dispatch(check());
        }
    },[auth, authError, dispatch]);

    useEffect(()=>{
        if(user){
            //로그인후 /으로 이동
            history.push('/');
            //로그인 상태 유지
            try{
                localStorage.setItem('user', JSON.stringify(user));
            } catch(e){
                console.log('localStorage is not working');
            }
        }
    }, [history, user]);


    return (
        <AuthForm
            type="login"
            form={form}
            onChange={onChange}
            onSubmit={onSubmit}
            error={error}/>
    );
};

export default withRouter(LoginForm);