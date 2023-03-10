export interface IPlatformResponse {
    id: string,
    collectionId: string,
    collectionName: string,
    created: Date | string,
    updated: Date | string,
    name: string,
    address: string,
    icon: string
}

export interface ICredentialResponse {
    collectionId: string,
    collectionName: string,
    created: Date,
    id: string,
    password: string,
    platform_id: string,
    status: string,
    updated: Date,
    user: string
}

export interface IRepairResponse {
    id: string,
    collectionId: string,
    collectionName: string,
    created: Date,
    updated: Date,
    jenis: string,
    operator: string,
    pengguna: string,
    status: string,
    catatan: string,
    foto: string
}

export interface ITaskResponse {
    id: string,
    collectionId: string,
    collectionName: string,
    created: Date,
    updated: Date,
    todo: string,
    daily: boolean,
    expand?: any
    status?: any
}

export interface IUserResponse {
    id: string;
    collectionId: string;
    collectionName: string;
    username: string;
    verified: boolean;
    emailVisibility: boolean;
    email: string;
    created: Date;
    updated: Date;
    name: string;
    avatar: string;
}