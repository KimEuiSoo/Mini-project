import React from "react";
import clsN from "classnames"
import styles from "./styles/Header.module.scss"
import { useLocation, useNavigate } from "react-router-dom";
import { getCookie, removeCookie } from "../../../util/cookie/Cookie";

type LoginStatus = "admin" | "user" | "guest";

const Header = () => {
    const navigation = useNavigate();
    const location = useLocation();

    const accessToken = getCookie("AccessToken");
    const adminToken = process.env.REACT_APP_ADMIN_TOKEN;
    
    const isMainPage = location.pathname === "/";
    const isManagerPage = location.pathname === "/manager";

    const getLoginStatus = (): LoginStatus => {
        if (!accessToken) {
            return "guest";
        }

        if (adminToken && accessToken === adminToken) {
            return "admin";
        }

        return "user";
    };

    const loginStatus = getLoginStatus();

    const onMainHandle = () => {
        navigation("/");
    };

    const onLoginHandle = () => {
        navigation("/login");
    };

    const onAdminHandle = () => {
        navigation("/manager");
    };

    const onLogoutHandle = () => {
        removeCookie("AccessToken");
        navigation("/login");
    };

    return (
        <header className={clsN(styles["header"])}>
            <nav className={clsN(styles["header-nav"])}>
                <div className={clsN(styles["header-nav__inner"])}>
                    <h1 className={clsN(styles["header-nav__title"])}>
                        {isManagerPage ? "관리자 페이지" : "파일 관리 시스템"}
                    </h1>

                    <div className={clsN(styles["header-nav__menu"])}>
                        {isManagerPage && (
                            <button
                                type="button"
                                className={clsN(styles["header-nav__link"])}
                                onClick={onMainHandle}
                            >
                                메인으로
                            </button>
                        )}

                        {isMainPage && loginStatus === "admin" && (
                            <button
                                type="button"
                                className={clsN(styles["header-nav__link"])}
                                onClick={onAdminHandle}
                            >
                                관리자
                            </button>
                        )}

                        {loginStatus === "guest" ? (
                            <button
                                type="button"
                                className={clsN(styles["header-nav__link"])}
                                onClick={onLoginHandle}
                            >
                                로그인
                            </button>
                        ) : (
                            <button
                                type="button"
                                className={clsN(styles["header-nav__logout"])}
                                onClick={onLogoutHandle}
                            >
                                로그아웃
                            </button>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header