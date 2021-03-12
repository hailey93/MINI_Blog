//로그인 상태 확인
const checkLoggedIn=(ctx, next)=>{
    if(!ctx.state.user){
        ctx.status=401;
        return;
    }
    return next();
};

export default checkLoggedIn;