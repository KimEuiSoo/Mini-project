import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {Logo} from '../../src/logo/Logo'
import './hompage.css';

const HomePage = () => {
    const [message, setMessage] = useState("")
    const [isActive, setActive] = useState(false);
    const handleDragStart = () => setActive(true);
    const handleDragEnd = () => setActive(false);
    
    const handleDrop = async (event: React.DragEvent) => {
        event.preventDefault();

        const file = event.dataTransfer.files[0];
            if (!file) return;

        const result = await uploadFile(file);
        console.log(result);
    };

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:8000/upload", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            throw new Error("업로드 실패");
        }
        return await res.json();
    };

    return(
        <div>
            <label className={`preview${isActive ? ' active' : ''}`}  // isActive 값에 따라 className 제어
                   onDragEnter={handleDragStart}  // dragstart 핸들러 추가
                   onDragLeave={handleDragEnd}  // dragend 핸들러 추가
                   onDrop={handleDrop}>
                <input type="file" className="file" />
                <Logo />
                <p className="preview_msg">클릭 혹은 파일을 이곳에 드롭하세요.</p>
                <p className="preview_desc">파일당 최대 3MB</p>
            </label>
        </div>
    )
}

export default HomePage;