import { Cookies } from "react-cookie";

const cookies = new Cookies

// 쿠키 저장
export const setCookie = <T>(name: string, value: string, option?: T) => {
    return cookies.set(name, value, {
        ...option,
        secure: true,
        sameSite: 'strict',
    });
}

export const getCookie = (name: string) => {
    return cookies.get(name)
}

export const removeCookie = <T>(name: string, option?: T) => {
    return cookies.remove(name, {
        ...option,
        secure: true,
        sameSite: 'strict',
    });
}