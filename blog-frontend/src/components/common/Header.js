import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from './Button';
import Responsive from './Responsive';

const HeaderBlock=styled.div`
    position: fixed; //언제나 페이지 상단에 떠있는다. 
    width: 100%;
    background: white;
    box-shadow: 0px 2px 4px rgba(0,0,0,0.08);
`;
//Responsive 컴포넌트 속성에 스타일 추가해서 새로운 컴포넌트 생성
const Wrapper=styled(Responsive)`
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: space-between; //자식 엘리먼트 사이 여백 최대로 설정
    .logo{
        font-size: 1.125rem;
        font-weight: 800;
        letter-spacing: 2px;
    }
    .right{
        display: flex;
        align-items: center;
    }
`;

//header가 fixed로 되어있기 때문에 페이지 콘텐츠가 4rem아래에 나타나도록 해주는 컴포넌트
const Spacer=styled.div`
    height: 4rem;
`;
const UserInfo=styled.div`
    font-weight: 800;
    margin-right: 1rem;
`;

const Header=({user, onLogout})=>{
    return (
        <>
            <HeaderBlock>
                <Wrapper>
                    <Link to="/" className="logo">REACT</Link>
                    {user?(
                        <div className="right">
                            <UserInfo>{user.username}</UserInfo>
                            <Button onClick={onLogout}>로그아웃</Button>
                        </div>
                    ):(
                        <div className="right">
                            <Button to="/login">로그인</Button>
                        </div>
                    )}                    
                </Wrapper>
            </HeaderBlock>
            <Spacer/>
        </>
    );
};

export default Header;