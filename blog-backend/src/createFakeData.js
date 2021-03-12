import Post from './models/post';

export default function createFakeData() {
    const posts=[...Array(40).keys()].map(i=>({
        title: `포스트#${i}`,
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, \n\
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris \n\
        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in \n\
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla \n\
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in\n\
        culpa qui officia deserunt mollit anim id est laborum.',
        tags: ['가짜', '데이터'],
    }));
    Post.insertMany(posts, (err, docs)=>{
        console.log(docs);
    });
}