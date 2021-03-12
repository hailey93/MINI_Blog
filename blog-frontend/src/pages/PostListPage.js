import React from 'react';
import HeaderContainer from '../containers/common/HeaderContainer';
import PaginationConatiner from '../containers/posts/PaginationConatiner';
import PostListContainer from '../containers/posts/PostListContainer';

const PostListPage=()=>{
    return (
        <>
            <HeaderContainer/>
            <PostListContainer/>
            <PaginationConatiner/>
        </>
    );
};

export default PostListPage;