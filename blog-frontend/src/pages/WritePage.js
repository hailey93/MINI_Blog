import React from 'react';
import { Helmet } from 'react-helmet-async';
import Responsive from '../components/common/Responsive';
import EditorContainer from '../containers/write/EditorContainer';
import TagBoxContainer from '../containers/write/TagBoxContainer';
import WriteActionButtonsContianer from '../containers/write/WriteActionButtonsContianer';

const WritePage=()=>{
    return (
        <Responsive>
            <Helmet>
                <title>글 작성하기</title>
            </Helmet>
            <EditorContainer/>
            <TagBoxContainer/>
            <WriteActionButtonsContianer/>
        </Responsive>
    );
};

export default WritePage;