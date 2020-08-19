import React, { useState } from 'react'
import Axios from 'axios'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';

function LoginPage(props) {
    // prop state에 state을 만들어야함
// email과 password를 위한 state을 만듬

    const dispatch = useDispatch();

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
//이니셜스테잇 첨에 이메일 어케 되는지?
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }
    //타이핑을 할 때, state를 바꿔 주면은 value가 바뀐다. 그런 로직
    //타이핑을 할 때, onChange를 작동시켜서 state를 바꿔주고 state를 바꿔주면은
    //value가 바뀐다.
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();

    //서버에 보내서 로그인을 시켜야할 때 서버에 보내야하는 값들을 state에서 가지고 있음 보낼때는
    //axios를 씀

        let body = {
            email: Email,
            password: Password
        }
    //여기서 보낸다음에, 서버 index.js (만들어놓았던 것) 에서 가서 login 함수별로
        //이메일 비밀번호 토큰이 맞는지 확인하고 토큰 만들어서 쿠키에 저장해주고
        //다 맞다면 로그인 성공을 할 수 있게 클라이언트에 다시 보내줌

        //여기서 redux를 사용하면, dispatch를 이용해서 action을 취하는 것 먼저 함
        //순서 1. action > reducer > store > React Component

        dispatch(loginUser(body))
            .then(response => {
                if (response.payload.loginSuccess) {
                    props.history.push('/')
                } else {
                    alert('Error˝')
                }
            })

             //로그인성공하면 다시 돌아가게 //react의 화면 이동 부분 코드


    }
    return (
        <div style={{
            display: 'flex',justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button type="submit">
                    Login
                </button>
            </form>
            </div>
            )
    }
    export default LoginPage
