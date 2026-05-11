import React, { useEffect, useState } from "react";
import clsN from 'classnames';
import useAxios from "../../hooks/useAxios";
import { loginResponse } from "../../models/loginResponse";
import { setCookie } from "../../util/cookie/Cookie";
import styles from "./styles/LoginPage.module.scss"
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigation = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  const fetch = useAxios<loginResponse>({
		method: 'post',
		url: '/login',
		data: {
			email,
			password: `${password}`,
		},
	});

  const onClickHandle = () => {
    const adminId = process.env.REACT_APP_ADMIN_ID;
    const adminPw = process.env.REACT_APP_ADMIN_PW;
    const adminToken = process.env.REACT_APP_ADMIN_TOKEN;
  
    if (email === adminId && password === adminPw) {
      if (!adminToken) {
        alert("관리자 토큰이 설정되지 않았습니다.");
        return;
      }
  
      setCookie("AccessToken", adminToken);
      navigation("/manager");
      return;
    }else{
      fetch[1]();
    }
  }

  const onSignupHandle = () => {
    navigation('/signup')
  }

  useEffect(()=>{
    if(fetch[0].response){
      const {access_token} = fetch[0].response;
      setCookie('AccessToken', `${access_token}`)
      navigation('/');
    }
  },[fetch[0].response])

  return (
    <div className={clsN(styles.login)}>
      <div className={clsN(styles['login-wrapper'])}>
        <h1 className={clsN(styles['login-wrapper__title'])}>로그인</h1>
        <form onSubmit={handleSubmit} className={clsN(styles['login-wrapper__id'], "space-y-5")}>
          <label htmlFor="customMail" className={clsN(styles['login-wrapper__id__text'])}>이메일</label>
          <input className={clsN(styles['login-wrapper__id__input'])}
                 type="text"
                 id="customMail"
                 placeholder="user@example.com"
                 onChange={(e) => setEmail(e.target.value)}/>
        </form>
        <form onSubmit={handleSubmit} className={clsN(styles['login-wrapper__pw'], "space-y-5")}>
          <label htmlFor="customMail" className={clsN(styles['login-wrapper__pw__text'])}>비밀번호</label>
          <input className={clsN(styles['login-wrapper__pw__input'])}
                 type="password"
                 id="customMail"
                 placeholder="test1234"
                 onChange={(e) => setPassword(e.target.value)}/>
        </form>
        <button type="submit" className={clsN(styles['login-wrapper__button'])} onClick={onClickHandle}>로그인</button>
        <div className={clsN(styles['login-wrapper__signup'])}>
          <p>계정이 없으신가요?</p>
          <button onClick={onSignupHandle}>회원가입</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
