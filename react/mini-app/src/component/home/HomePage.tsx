import React, {useState, useEffect, useCallback} from 'react';
import clsN from 'classnames';
import styles from './styles/HomePage.module.scss'
import UploadSVG from '../../asset/svg/UploadSVG';
import useAxios from '../../hooks/useAxios';
import { getCookie } from '../../util/cookie/Cookie';
import { fileResponse, uploadResponse } from '../../models/uploadResponse';
import FolderSVG from '../../asset/svg/FolderSVG';
import SettingSVG from '../../asset/svg/SeetingSVG';
import FileList from '../file/FileList';
import Modal from "../common/modal/Modal";
import { SummaryResponse } from '../../models/SummaryResponse';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { loadingAtom } from '../../recoil/atom/loadingAtom';
import Loading from '../layout/loading/Loading';


const HomePage = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [summaryText, setSummaryText] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<fileResponse | null>(null);
    const [formData, setformData] = useState<FormData>();
    const [files, setFiles] = useState<fileResponse[]>();
    const accessToken = getCookie('AccessToken');
    const loading = useRecoilValue(loadingAtom);
    
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

    

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
    };

    const fetchUpload = useAxios<uploadResponse>({
        method: 'post',
        url: '/file/upload',
        config: {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        },
        data: formData
    })

    const fetchFile = useAxios<fileResponse[]>({
        method: 'get',
        url: '/file/list',
    })

    const fetchSummary = useAxios<SummaryResponse>({
        method: "post",
        url: selectedFile ? `/summary/${selectedFile.fileId}` : "",
        config: {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    });

    const uploadHandle = (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        setformData(formData);
    }

    const fileClickHandle = async (file: fileResponse) => {
        setSelectedFile(file);
        setIsModalOpen(true);
    }

    useEffect(() => {
        if(selectedFile){
            fetchSummary[1]()
        }
    }, [selectedFile])

    useEffect(()=>{
        fetchFile[1]();
    },[])

    useEffect(()=>{
        if(formData){
            fetchUpload[1]();
        }
    }, [formData])

    useEffect(() => {
        if(fetchSummary[0].response){
            setSummaryText(fetchSummary[0].response.summaryText)
        }
    },[fetchSummary])

    useEffect(()=>{
        if(fetchUpload[0].response){
            const {message} = fetchUpload[0].response
            alert(message)
        }
    },[fetchUpload])

    useEffect(()=>{
        if(fetchFile[0].response){
            setFiles(fetchFile[0].response)
        }
    },[fetchFile])

    return(
        <div className={clsN(styles.home)}>
            {loading ? <Loading/> : <div>
                
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
                        <h3>내 파일 관리</h3>
                        <p>업로드된 파일을 체계적으로 관리하고 정리하세요</p>
                    </label>
                    
                    <label className={clsN(styles['home-wrapper__button'])}>
                        <SettingSVG/>
                        <h3>간편 설정</h3>
                        <p>직관적인 인터페이스로 쉽게 설정을 변경하세요</p>
                    </label>
                </div>
                {files && <FileList files={files} onClick={fileClickHandle} isOpen={isModalOpen} closeModal={closeModal}/>}
            </div>
            <Modal isOpen={isModalOpen} closeModal={closeModal}>
                {selectedFile && (
                    <div>
                        <h2>파일 정보</h2>

                        <p>
                            <strong>파일명</strong>
                            <br />
                            {selectedFile.fileName}
                        </p>

                        <p>
                            <strong>파일 경로</strong>
                            <br />
                            {selectedFile.filePath}
                        </p>

                        <p>
                            <strong>파일 타입</strong>
                            <br />
                            {selectedFile.fileType}
                        </p>

                        {selectedFile.createdAt && (
                            <p>
                                <strong>업로드 날짜</strong>
                                <br />
                                {selectedFile.createdAt}
                            </p>
                        )}

                        <p>
                            <strong>파일 요약</strong>
                            <br />
                            {summaryText}
                        </p>

                        <button onClick={closeModal}>
                            닫기
                        </button>
                    </div>
                )}
            </Modal>
            </div>}
        </div>
    )
}

export default HomePage;