import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Editor from '../../components/write/Editor';
import { changeField, initialize } from '../../modules/write';

const EditorContainer=()=>{
    const dispatch=useDispatch();
    //리덕스 스토어에서 title, body 불러오기
    const {title, body}=useSelector(({write})=>({
        title:write.title,
        body:write.body,
    }));

    const onChangeField=useCallback(payload=>dispatch(changeField(payload)),[dispatch]);

    useEffect(()=>{
        return()=>{
            dispatch(initialize());
        }
    },[dispatch]);

    return (
        <Editor onChangeField={onChangeField} title={title} body={body}/>
    );
};

export default EditorContainer;