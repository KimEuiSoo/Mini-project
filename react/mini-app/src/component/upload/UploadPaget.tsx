import React, { useCallback, useEffect, useState } from 'react';
import {Logo} from '../../asset/svg/Logo'
import useAxios from '../../hooks/useAxios';
import { getCookie } from '../../util/cookie/Cookie';
import { uploadResponse } from '../../models/uploadResponse';

const Upload = () => {
    const [formData, setformData] = useState<FormData>();
    const accessToken = getCookie('AccessToken');
    const [isActive, setActive] = useState(false);
    const handleDragStart = () => setActive(true);
    const handleDragEnd = () => setActive(false);
    
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
        <div>
            <label className={`preview${isActive ? ' active' : ''}`}  // isActive 값에 따라 className 제어
                   onDragEnter={handleDragStart}  // dragstart 핸들러 추가
                   onDragLeave={handleDragEnd}  // dragend 핸들러 추가
                   onDragOver={handleDragOver}
                   onDrop={handleDrop}>
                <input type="file" className="file"/>
                <Logo />
                <p className="preview_msg">클릭 혹은 파일을 이곳에 드롭하세요.</p>
                <p className="preview_desc">파일당 최대 3MB</p>
            </label>
        </div>
    )
}

export default Upload;