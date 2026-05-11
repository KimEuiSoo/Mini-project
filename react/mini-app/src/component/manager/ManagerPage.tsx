import React, { useEffect, useState } from "react";
import clsN from "classnames"
import styles from "./styles/ManagerPage.module.scss"
import ManagerFileList from "./ManagerFileList";
import useAxios from "../../hooks/useAxios";
import { fileResponse,fileSearchResponse } from "../../models/uploadResponse";
import { Upload } from 'lucide-react';

const ManagerPage = () => {
    const [files, setFiles] = useState<fileResponse[]>();
    const [search, setSearch] = useState<string>();

    /* 파일 리스트 조회 api*/
    const fetchFile = useAxios<fileResponse[]>({
        method: 'get',
        url: '/file/list',
    })

    /* 파일 검색 조회 api */
    const fetchSearch = useAxios<fileSearchResponse>({
        method: 'get',
        url: '/file/admin/search',
        config: {
            params: {
                keyword: search,
            }
        }
    })
    
    /* mount, unmount 시 useEffect 실행
       => useEffect가 실행하면 fetchFile 함수를 실행하여 file 조회를 시작한다 */
    useEffect(()=>{
        fetchFile[1]();
    },[])
    
    /* mount, unmount, 파일 리스트 response가 업데이트 시 useEffect 실행
        => useEffect가 실행하면 파일 response가 있는지를 판단하여 files의 상태를 변경시킨다. */
    useEffect(()=>{
        if(fetchFile[0].response){
            setFiles(fetchFile[0].response)
        }
    },[fetchFile[0].response])

    /* mount, unmount, 검색어가 업데이트 시 useEffect 실행
        => useEffect가 실행하면 검색어를 fetchSearch에 검색어 파라미터를 넣어줘 api를 작동 시킨다. */
    useEffect(()=>{
        console.log(search);
        if(search){
            fetchSearch[1]()
        }
    },[search])

    /* mount, unmount, 검색어 조회 response가 업데이트 시 useEffect 실행
        => useEffect가 실행하면 검색어 조회 response로 files의 상태를 변경시킨다. */
    useEffect(() => {
        if (fetchSearch[0].response) {
            const { message, data } = fetchSearch[0].response;
        
            console.log(message);
            setFiles(data);
        
            if (data.length === 0) {
                alert(message);
            }
        }
    }, [fetchSearch[0].response]);

    const onSearch = (text: string) => {
        const keyword = text.trim();

        if (!keyword) {
            setSearch("");
            fetchFile[1]();
            return;
        }

        setSearch(keyword);
    }

    return(
        <div className={clsN(styles.manager)}>
            <div className={clsN(styles['manager-wrapper'])}>
                <div className={clsN(styles['manager-title'])}>
                    <h1>파일 관리</h1>
                    <button>
                        <Upload/>
                        업로드
                    </button>
                </div>
                {files && <ManagerFileList files={files} onSearch={onSearch}/>}                
            </div>
        </div>
    )
}

export default ManagerPage