const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const {auth} = require('./middleware/auth');
const { User } = require("./models/User");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))





app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api/hello', (req,res) => res.send('Hello world~'))


//회원가입을 위한 route 만들기

app.post('/api/users/register',(req, res) => {
//클라이언트에서 보내주는 이메일,비밀번호 정보들을 클라이언트에서 가져오면
//그것들을 데이터베이스에 넣어준다


    const user = new User(req.body)
    //req.body는 데이터가 들어올 수 있게 해주는 것 : 아이디나 비밀번호의 데이터
    //이게 가능한 이유는 bodyparser가 있어서 이다. 위의 코드 참조

    user.save((err, userInfo) => {
        //에러가 있다고 하면
        if(err) return res.json({ success: false, err}) // json 형식으로 만듬
        return res.status(200).json({
            success: true
        }) //성공했다는 뜻 
    }) //정보들이 유저 모델에 저장
})


//Login Route

app.post('/api/users/login', (req,res) => {

    User.findOne({ email: req.body.email }, (err, user) => {
      if(!user) {
        return res.json({
          loginSuccess: false,
          message: "제공된 이메일에 해당하는 유저가 없습니다."
        })
      }
  
      user.comparePassword(req.body.password , (err, isMatch ) =>{
  
        if(!isMatch)
          return res.json({ loginSuccess: false, message:"비밀번호가 틀렸습니다."})
  
          user.generateToken((err, user) => {
            if(err) return res.status(400).send(err);
            res.cookie("x_auth",user.token)
            .status(200)
            .json({loginSuccess: true, userId: user._id})
            })
         })

    })
})
//바꿀 수 있다.
// role 1 -> Admin
// role 2 -> 특정부서
// 지금 상황 : role 0 ->일반유저 role 이 0이 아니면 관리자




app.get('/api/users/auth', auth, (req, res) => {
    //콜백하기전에 중간에서 뭘 해준다. (auth.js)
  
    //여기까지 미들웨어를 통과해왔다는 이야기는 auth가 true라는 말
  
    res.status(200).json({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      image: req.user.image
  
      //정보를 주면 어떤 페이지에서도 유저 정보를 이용할 수 있기 때문에 편리
  
    })
  
  
  })

  //logout rougt
app.get('/api/users/logout', auth, (req, res) =>{

    User.findOneAndUpdate({_id: req.user._id}, 
      {token: ""}
      , (err,user) => {
        if(err) return res.json({ success: false, err});
        return res.status(200).send({
          success: true
        })
      })
  })
  
  




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})