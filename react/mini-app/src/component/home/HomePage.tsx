import axios from 'axios';
import React, { useEffect, useState } from 'react';

const HomePage = () => {
    const [message, setMessage] = useState("")

    useEffect(()=>{
        axios.get("http://localhost:8000/")
            .then(res=>setMessage(res.data.message))
            .catch(err=>console.error(err));
    },[])

    return(
        <div>
            <h1>FastAPI 연동</h1>
            <p>FastAPI 파라미터 : {message}</p>
        </div>
    )
}

export default HomePage;