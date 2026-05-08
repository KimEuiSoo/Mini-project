import React, { useEffect, useState } from "react";
import clsN from 'classnames';
import { useNavigate } from "react-router-dom";
import styles from './styles/SignupPage.module.scss'
import { loginResponse } from "../../models/loginResponse";
import useAxios from "../../hooks/useAxios";
import { setCookie } from "../../util/cookie/Cookie";

const SignupPage = () => {
    const navigation = useNavigate()
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1800);
    };

    const fetch = useAxios<loginResponse>({
		method: 'post',
		url: '/signup',
		data: {
			email,
			password: `${password}`,
            name,
		},
	});

    const fetchLogin = useAxios<loginResponse>({
		method: 'post',
		url: '/login',
		data: {
			email,
			password: `${password}`,
		},
	});

    useEffect(()=>{
        if(fetch[0].response){
            fetchLogin[1]();
        }
    },[fetch[0].response])

    useEffect(()=>{
        if(fetchLogin[0].response){
            const {access_token} = fetchLogin[0].response;
            setCookie('AccessToken', `${access_token}`);
            navigation('/');
        }
    }, [fetchLogin[0].response])

    const onSignupHandle = () => {
        fetch[1]()
    }

    const onLoginHandle = () => {
        navigation('/login');
    }

    return(
        <div className={clsN(styles.signup)}>
            <div className={clsN(styles['signup-wrapper'])}>
                <h1 className={clsN(styles['signup-wrapper__tile'])}>회원가입</h1>
                <form onSubmit={handleSubmit} className={clsN(styles['signup-wrapper__nm'], "space-y-5")}>
                    <label htmlFor="customName" className={clsN(styles['signup-wrapper__nm__text'])}>이름</label>
                    <input className={clsN(styles['signup-wrapper__pw__input'])}
                           type="text"
                           id="customName"
                           placeholder="홍길동"
                           onChange={(e) => setName(e.target.value)}/>
                </form>
                <form onSubmit={handleSubmit} className={clsN(styles['signup-wrapper__id'], "space-y-5")}>
                    <label htmlFor="customMail" className={clsN(styles['signup-wrapper__id__text'])}>이메일</label>
                    <input className={clsN(styles['signup-wrapper__id__input'])}
                            type="text"
                            id="customMail"
                            placeholder="user@example.com"
                            onChange={(e) => setEmail(e.target.value)}/>
                </form>
                <form onSubmit={handleSubmit} className={clsN(styles['signup-wrapper__pw'], "space-y-5")}>
                    <label htmlFor="customPassword" className={clsN(styles['signup-wrapper__pw__text'])}>비밀번호</label>
                    <input className={clsN(styles['signup-wrapper__pw__input'])}
                           type="password"
                           id="customPassword"
                           placeholder="test1234"
                           onChange={(e) => setPassword(e.target.value)}/>
                </form>
                <form onSubmit={handleSubmit} className={clsN(styles['signup-wrapper__pw'], "space-y-5")}>
                    <label htmlFor="customConfirmPassword" className={clsN(styles['signup-wrapper__pw__text'])}>비밀번호 확인</label>
                    <input className={clsN(styles['signup-wrapper__pw__input'])}
                           type="password"
                           id="customConfirmPassword"
                           placeholder="test1234"
                           onChange={(e) => setConfirmPassword(e.target.value)}/>
                </form>
                <button type="submit" className={clsN(styles['signup-wrapper__button'])} onClick={onSignupHandle}>회원가입</button>
                <div className={clsN(styles['signup-wrapper__login'])}>
                    <p>계정이 이미 있으신가요??</p>
                <button onClick={onLoginHandle}>로그인</button>
                </div>
            </div>
        </div>
    )
}

export default SignupPage