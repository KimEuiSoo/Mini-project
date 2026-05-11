export interface uploadResponse {
    message: string,
    user: string
}

export interface fileResponse{
    fileId: number,
    userId: number,
    filePath: string,
    fileName: string,
    fileType: string,
    createdAt: string,
}

export interface fileSearchResponse{
    message: string,
    data: fileResponse[],
    code: number,
}