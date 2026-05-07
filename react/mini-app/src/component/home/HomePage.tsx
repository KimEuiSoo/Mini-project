import React, {useState, useEffect, useCallback} from 'react';
import clsN from 'classnames';
import styles from './styles/HomePage.module.scss'
import UploadSVG from '../../asset/svg/UploadSVG';
import useAxios from '../../hooks/useAxios';
import { getCookie } from '../../util/cookie/Cookie';
import { uploadResponse } from '../../models/uploadResponse';
import FolderSVG from '../../asset/svg/FolderSVG';
import SettingSVG from '../../asset/svg/SeetingSVG';


const HomePage = () => {
    const [formData, setformData] = useState<FormData>();
    const accessToken = getCookie('AccessToken');
    
    const handleDrop = useCallback(async (event: React.DragEvent<HTMLLabelElement>) => {
        console.log("실행");
        event.preventDefault();

        const file = event.dataTransfer.files[0];
            if (!file) return;

        const result = uploadHandle(file)
        console.log(result);
    }, [])

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
    };

    const fetchUpload = useAxios<uploadResponse>({
        method: 'post',
        url: '/upload',
        config: {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        },
        data: formData
    })

    const uploadHandle = (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        setformData(formData);
    }

    useEffect(()=>{
        if(formData){
            fetchUpload[1]();
        }
    },[formData])

    useEffect(()=>{
        if(fetchUpload[0].response){
            const {message} = fetchUpload[0].response
            alert(message)
        }
    },[fetchUpload])

    return(
        <div className={clsN(styles.home)}>
            <div className={clsN(styles['home-wrapper'])}>
                <h2>파일 관리 시스템에 오신 것을 환영합니다</h2>
                <p>간편하고 안전한 파일 업로드 및 관리</p>
                <div className={clsN(styles['home-wrapper__grid-box'])}>
                    <label className={clsN(styles['home-wrapper__button'])}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}>
                        <UploadSVG/>
                        <h3>파일 업로드</h3>
                        <p>다양한 형식의 파일을 빠르고 안전하게 업로드하세요</p>
                    </label>
                    
                    <label className={clsN(styles['home-wrapper__button'])}>
                        <FolderSVG/>
                        <h3>파일 관리</h3>
                        <p>업로드된 파일을 체계적으로 관리하고 정리하세요</p>
                    </label>
                    
                    <label className={clsN(styles['home-wrapper__button'])}>
                        <SettingSVG/>
                        <h3>간편 설정</h3>
                        <p>직관적인 인터페이스로 쉽게 설정을 변경하세요</p>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default HomePage;