import React from "react";
import clsN from 'classnames';
import styles from './styles/FileList.module.scss'
import { fileResponse } from "../../models/uploadResponse";
import FileSVG from "../../asset/svg/FileSVG";
import Modal from "../common/modal/Modal";

interface FileListProps{
    files: fileResponse[]
    onClick: (file: fileResponse) => void
    isOpen: boolean
    closeModal: () => void
}

const FileList = ({files, onClick, isOpen, closeModal}: FileListProps) => {

    return(
        <div className={clsN(styles['file-wrapper'])}>
            <h2>전체 파일</h2>
            {files && 
                <div className={clsN(styles['file-wrapper__file-list'])}>
                    {files.map((file) => (
                        <div>
                            <button key={file.fileId} onClick={() => onClick && onClick(file)}>
                                <FileSVG/>
                                {file.fileName}
                            </button>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default FileList;