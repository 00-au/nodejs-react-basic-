import { combineReducers } from 'redux';
//store 가 있을 때, redux들이 여러가지 있을 수 있음
//마지막 값을 리턴해주는 것이 redux인데 user redux 등등 여러 종목이 있다.
//이것을 combinreducer를 이용해서 하나로 합쳐줌
//로그인 기능, 레지스터 기능 등등을 만들려고 할 때 하나로 합쳐서 주는 것
import user from './user_reducer';


const rootReducer = combineReducers({
    user
})

export default rootReducer;