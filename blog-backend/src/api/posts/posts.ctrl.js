import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'Joi';
import sanitizeHtml from 'sanitize-html';

//아이디 유효성 검사
const {ObjectId}=mongoose.Types;

//html필터링시 허용할 태그 및 속성 설정
const sanitizeOption={
    allowedTags:[
        'h1',
        'h2',
        'b',
        'i',
        'u',
        's',
        'p',
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'img',
    ],
    allowedAttributes:{
        a: ['href', 'name', 'target'],
        img: ['src'],
        li: ['class'],
    },
    allowedSchemes: ['data', 'http'],
};

//id로 포스트 조회
export const getPostById=async (ctx, next)=>{
    const {id}=ctx.params;
    if(!ObjectId.isValid(id)){
        ctx.status=400;
        return;
    }
    try{
        const post=await Post.findById(id);
        if(!post){
            ctx.status=404;
            return;
        }
        ctx.state.post=post;
        return next();   
    } catch(e){
        ctx.throw(500, e);
    }
};
//id로 찾은 포스트가 로그인 중인 사용자가 작성한 포스트인지 확인
export const checkOwnPost=(ctx, next)=>{
    const {user, post}=ctx.state;
    if(post.user._id.toString()!==user._id){
        ctx.status=403;
        return;
    }
    return next();
};

//html을 없애고 내용이 길면 200자로 제한
const removeHtmlAndShorten=body=>{
    const filtered=sanitizeHtml(body, {
        allowedTags: [],
    });
    return filtered.length <200? filtered: `${filtered.slice(0, 200)}...`;
};

//컨트롤러 함수 작성
/* 포스트 작성 POST /api/posts   {title, body} */
export const write=async ctx=>{
    const schema=Joi.object().keys({
        //객체가 다음 필드를 가지고 있는지 검증
        title: Joi.string().required(), //required 있으면 필수항목
        body: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).required(), 
    });
    //검증 후 실패면 에러 처리
    const result=schema.validate(ctx.request.body);
    if(result.error){
        ctx.status=400;
        ctx.body=result.error;
        return;
    };

    const {title, body, tags}=ctx.request.body;
    const post=new Post({
        title,
        body: sanitizeHtml(body, sanitizeOption),
        tags,
        user: ctx.state.user,
    });
    try{
        await post.save(); //save함수를 실행시켜에 db에 저장된다
        ctx.body=post;
    } catch(e){
        ctx.throw(500, e);
    }
};


/* 포스트 목록 조회 GET /api/posts */
export const list=async ctx=>{
    const page=parseInt(ctx.query.page||'1', 10);
    if(page<1){
        ctx.status=400;
        return;
    }
    const {tag, username}=ctx.query;
    //tag, username 값이 유효할때만 객체 안에 넣고 아니면 넣지 않는다.
    const query={
        ...(username?{'user.username':username}:{}),
        ...(tag?{tags:tag}:{}),
    };

    try{
        const posts=await Post.find(query)
                              .sort({_id:-1})
                              .limit(10)
                              .skip((page-1)*10)
                              .lean()
                              .exec(); //find호출후 exec을 붙여야 서버에 쿼리를 요청한다
        //커스텀 헤더 설정
        const postCount=await Post.countDocuments(query).exec();
        ctx.set('Last-Page', Math.ceil(postCount/10));
        //내용 길이 제한
        ctx.body=posts.map(post=>({
                          ...post,
                          body: removeHtmlAndShorten(post.body),
                      }));
    } catch(e){
        ctx.throw(500, e);
    }
};

/* 특정 포스트 조회 GET  /api/posts:id */
export const read=async ctx=>{
    ctx.body=ctx.state.post;
};

/* 특정 포스트 제거 DELETE  /api/posts/:id */
export const remove=async ctx=>{
    const {id}=ctx.params;
    try{
        await Post.findByIdAndRemove(id).exec();
        ctx.status=204;
    } catch(e){
        ctx.throw(500, e);
    }
};

/* 포스트 수정(특정 필드 변경)  PATCH  /api/posts/:id { title, body} */
export const update=async ctx=>{
    const {id}=ctx.params;
    const schema=Joi.object().keys({
        //객체가 다음 필드를 가지고 있는지 검증
        title: Joi.string(), 
        body: Joi.string(),
        tags: Joi.array().items(Joi.string()), 
    });
    //검증 후 실패면 에러 처리
    const result=schema.validate(ctx.request.body);
    if(result.error){
        ctx.status=400;
        ctx.body=result.error;
        return;
    };

    const nextData={...ctx.request.body};
    //body값이 주어졌으면 html 필터링
    if(nextData.body){
        nextData.body=sanitizeHtml(nextData.body, sanitizeOption);
    }
    try{
        const post=await Post.findByIdAndUpdate(id, nextData, {
            new: true, //이 값을 설정하면 업데이트된 데이터를 반환한다 false일때는 업데이트 되기 전 데이터를 반환한다.
        }).exec();
        if(!post){
            ctx.status=404;
            return;
        }
        ctx.body=post;
    } catch(e){
        ctx.throw(500, e);
    }
};
