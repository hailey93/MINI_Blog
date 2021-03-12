require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import serve from 'koa-static';
import path from 'path';
import send from 'koa-send';

import api from './api';
import jwtMiddleware from './lib/jwtMiddleware';

const {PORT, MONGO_URI}=process.env;
mongoose.connect(MONGO_URI, {useNewUrlParser: true, useFindAndModify: false})
        .then(()=>{
            console.log('Connected to MongoDB');
        })
        .catch(e=>{
            console.error(e);
        });

const app=new Koa();
const router=new Router();

//라우터 설정
router.use('/api', api.routes()); //api 라우트 적용

//라우트 적용전 bodyParser 적용
app.use(bodyParser());
//라우트 적용전 jwtMiddleware 적용
app.use(jwtMiddleware);

//app인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

const buildDirectory=path.resolve(__dirname, '../../blog-frontend/build');
app.use(serve(buildDirectory));
app.use(async ctx=>{
    if(ctx.status===404&&ctx.path.indexOf('/api')!==0){
        await send(ctx, 'index.html', {root: buildDirectory});
    }
});

//port가 지정되어있지않으면 4000 사용
const port=PORT||4000;
app.listen(port, ()=>{
    console.log('listeing to port %d', port);
});

