import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const UserSchema=new Schema({
    username:String,
    hashedPassword:String,
});
//인스턴스 메소드를 작성할때 화살표함수가 아닌 function키워드를 사용해야한다. 함수 내부에서 this에 접근해야하기 때문이다. 
UserSchema.methods.setPassword=async function (password) {
    const hash=await bcrypt.hash(password, 10);
    this.hashedPassword=hash; //여기서 this는 문서 인스턴스를 가르킨다. 
};

UserSchema.methods.checkPassword=async function (password) {
    const result=await bcrypt.compare(password, this.hashedPassword);
    return result;
};

UserSchema.statics.findByUsername=function (username) {
    return this.findOne({username}); //여기서 this는 모델을 가리킨다 즉 User을 가르킨다. 
}

UserSchema.methods.serialize=function () {
    const data=this.toJSON();
    delete data.hashedPassword;
    return data;
};

UserSchema.methods.generateToken=function () {
    const token=jwt.sign(
        //첫번째 파라미터에는 토큰안에 넣고 싶은 데이터, 두번째는 jwt암호를 넣는다. 
        {
            _id: this.id,
            username: this.username,
        },
        process.env.JWT_SECRET,
        {
            expiresIn:'7d', 
        },
    );
    return token;
}

const User=mongoose.model('User', UserSchema);
export default User;