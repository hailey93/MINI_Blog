import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import AuthForm from '../../components/auth/AuthForm';
import { changeField, initializeForm, register } from '../../modules/auth';
import { check } from '../../modules/user';

const RegisterForm=({history})=>{
    const dispatch=useDispatch();
    const {form, auth, authError, user}=useSelector(({auth, user})=>({
        form:auth.register,
        auth:auth.auth,
        authError:auth.authError,
        user:user.user
    }));
    const [error, setError]=useState(null);

    const onChange=e=>{
        const {value, name}=e.target;
        dispatch(changeField({
            form: 'register',
            key: name,
            value 
        }));
    };

    const onSubmit=e=>{
        e.preventDefault();
        const {username, password, passwordConfirm}=form;
        //하나라도 비어 있다면
        if([username, password, passwordConfirm].includes('')){
            setError('빈칸을 모두 입력하세요!');
            return;
        }
        //비밀번호 불일치시
        if(password!==passwordConfirm){
            setError('비밀번호가 일치하지 않습니다.');
            dispatch(changeField({form:'register', key:'password', value:''}));
            dispatch(changeField({form:'register', key:'passwordConfirm', value:''}));
            return;
        }
        dispatch(register({username, password}));
    };

    useEffect(()=>{
        dispatch(initializeForm('register'));
    }, [dispatch]);

    useEffect(()=>{
        if(authError){
            //계정 중복시
            if(authError.response.status===409){
                setError('이미 존재하는 계정입니다. 다른 아이디를 입력해주세요!');
                return;
            }
            //기타 이유
            setError('회원가입 실패!');
            return;
        }
        if(auth){
            console.log('회원가입 성공');
            console.log(auth);
            dispatch(check());
        }
    },[auth, authError, dispatch]);

    useEffect(()=>{
        if(user){
            history.push('/'); //회원가입 성공후 홈화면으로 이동
            try {
                localStorage.setItem('user', JSON.stringify(user));
            } catch(e){
                console.log('localStorage is not working');
            }
        }
    },[history, user]);

    return (
        <AuthForm
            type="register"
            form={form}
            onChange={onChange}
            onSubmit={onSubmit}
            error={error}/>
    );
};

export default withRouter(RegisterForm);