import {useState} from 'react';
import axios, {AxiosRequestConfig} from 'axios';
import {useNavigate} from "react-router-dom";
import { useRecoilState } from 'recoil';
import { loadingAtom } from '../recoil/atom/loadingAtom';

type AxiosProps = {
	method: 'get' | 'post' | 'put' | 'delete';
	url: string;
	data?: unknown;
	config?: AxiosRequestConfig;
};

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.headers.withCredentials = true;

const useAxios = <T, >({
	                       method = 'get',
	                       url,
	                       data,
	                       config,
                       }: AxiosProps): [
	{
		response: T | undefined;
	},
	() => void,
] => {
	const navigate = useNavigate();
	const [response, setResponse] = useState<T | undefined>();
	const [loading, setLoading] = useRecoilState(loadingAtom);
	
	const modifyLoading = (state: boolean) => {
		if (state)
			setLoading(loading + 1);
		else
			setLoading(loading - 1 < 0 ? 0 : loading - 1)
	}
	
	const execution = () => {
		modifyLoading(true);

		if(method === 'get' || method === 'delete'){
			axios[method](url, config)
				.then((res) => {
					setResponse(res.data);
				})
				.catch((err) => {
					alert(err.response.data.detail.message);
				})
				.finally(()=>{
					modifyLoading(false);					
				})
		}
		else {
			axios[method](url, data, config)
				.then((res) => {
					setResponse(res.data);
				})
				.catch((err) => {
					alert(err.response.data.detail.message);
				})
				.finally(() => {
					modifyLoading(false);
				});
		}
	};
	
	return [{response}, execution];
};

export default useAxios;