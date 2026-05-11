import React, { useRef } from "react";
import clsN from 'classnames';
import styles from './styles/ManagerFileList.module.scss'
import { fileResponse } from "../../models/uploadResponse";
import { Search } from 'lucide-react';
import { Download } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { EllipsisVertical } from 'lucide-react';

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
                        <Search/>
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
            <div className={clsN(styles["table-wrapper"])}>
                <table className={clsN(styles["file-table"])}>
                    <thead>
                        <tr>
                            <th className={clsN(styles["file-table__check"])}>
                                <input type="checkbox" />
                            </th>
                            <th>파일명</th>
                            <th>크기</th>
                            <th>업로드 날짜</th>
                            <th>업로더</th>
                            <th>작업</th>
                        </tr>
                    </thead>

                    <tbody>
                        {files.map((file) => (
                            <tr key={file.fileId}>
                                <td className={clsN(styles["file-table__check"])}>
                                    <input type="checkbox" />
                                </td>

                                <td>
                                    <div className={clsN(styles["file-table__name"])}>
                                        <span className={clsN(styles["file-table__icon"])}>📄</span>
                                        <span>{file.fileName}</span>
                                    </div>
                                </td>

                                <td>{files.length ? `${file.fileSize} B` : "-"}</td>

                                <td>{file.createdAt ?? "-"}</td>

                                <td>{file.fileName ?? "알 수 없음"}</td>

                                <td>
                                    <div className={clsN(styles["file-table__actions"])}>
                                        <button type="button" className={clsN(styles["file-table__download"])}>
                                            <Download/>
                                        </button>

                                        <button type="button" className={clsN(styles["file-table__delete"])}>
                                            <Trash2/>
                                        </button>

                                        <button type="button" className={clsN(styles["file-table__more"])}>
                                            <EllipsisVertical/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={clsN(styles["file-count"])}>
                전체 {files.length}개 파일 표시
            </div>
        </div>
    )
}

export default ManagerFileList