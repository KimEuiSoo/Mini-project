import React from "react";
import clsN from 'classnames';
import styles from './styles/FileList.module.scss'
import { fileResponse } from "../../models/uploadResponse";
import FileSVG from "../../asset/svg/FileSVG";

interface FileListProps{
    files: fileResponse[]
    onClick: (file: fileResponse) => void
}

const FileList = ({files, onClick}: FileListProps) => {
    return(
        <div className={clsN(styles['file-wrapper'])}>
            <h2>전체 파일</h2>
            {files && 
                <div className={clsN(styles['file-wrapper__file-list'])}>
                    {files.map((file) => (
                        <button onClick={() => onClick && onClick(file)}>
                            <FileSVG/>
                            {file.fileName}
                        </button>
                    ))}
                </div>
            }
        </div>
    )
}

export default FileList;