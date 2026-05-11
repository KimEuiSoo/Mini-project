import React, { useRef } from "react";
import clsN from 'classnames';
import styles from './styles/ManagerFileList.module.scss'
import { fileResponse } from "../../models/uploadResponse";

interface ManagerFileListProps{
    files: fileResponse[];
    onSearch: (text:string) => void;
}

const ManagerFileList = ({files, onSearch}: ManagerFileListProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    
    const onSearchHandle = () => {
        if (!inputRef.current) return;

        const searchText = inputRef.current.value;

        console.log(`${searchText} 검색완료`);
        
        onSearch(searchText);

        inputRef.current.value = '';
    }

    const onEnterSearchHandle = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            onSearchHandle();
        }
    };

    return(
        <div className={clsN(styles['file-wrapper'])}>
            <div className={clsN(styles["search-wrapper"])}>
                <div className={clsN(styles["search-wrapper__input-box"])}>
                    <button
                        type="button"
                        className={clsN(styles["search-wrapper__search-button"])}
                        onClick={onSearchHandle}
                    >
                        🔍
                    </button>

                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="파일 검색..."
                        onKeyDown={onEnterSearchHandle}
                        className={clsN(styles["search-wrapper__input"])}
                    />
                </div>

                <select className={clsN(styles["search-wrapper__select"])}>
                    <option value="all">모든 파일</option>
                    <option value="pdf">PDF</option>
                    <option value="docx">DOCX</option>
                    <option value="txt">TXT</option>
                    <option value="image">이미지</option>
                </select>
            </div>
        </div>
    )
}

export default ManagerFileList