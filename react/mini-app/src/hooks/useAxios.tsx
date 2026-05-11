import { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { useSetRecoilState } from "recoil";
import { loadingAtom } from "../recoil/atom/loadingAtom";

type AxiosProps = {
    method: "get" | "post" | "put" | "delete";
    url: string;
    data?: unknown;
    config?: AxiosRequestConfig;
};

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

const useAxios = <T,>({
    method = "get",
    url,
    data,
    config,
}: AxiosProps): [
    {
        response: T | undefined;
    },
    () => void,
] => {
    const [response, setResponse] = useState<T | undefined>();
    const setLoading = useSetRecoilState(loadingAtom);

    const startLoading = () => {
        setLoading((prev) => prev + 1);
    };

    const stopLoading = () => {
        setLoading((prev) => Math.max(prev - 1, 0));
    };

    const execution = () => {
        startLoading();

        const request =
            method === "get" || method === "delete"
                ? axios[method](url, config)
                : axios[method](url, data, config);

        request
            .then((res) => {
                setResponse(res.data);
            })
            .catch((err) => {
                console.error(err);

                const message =
                    err.response?.data?.detail?.message ||
                    err.response?.data?.detail ||
                    "요청 중 오류가 발생했습니다.";

                alert(message);
            })
            .finally(() => {
                stopLoading();
            });
    };

    return [{ response }, execution];
};

export default useAxios;