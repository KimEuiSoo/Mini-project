export interface uploadResponse {
    message: string,
    user: string
}

export interface fileResponse{
    fileid: number,
    userId: number,
    filePath: string,
    fileName: string,
    fileType: string,
    createdAt: string,
}