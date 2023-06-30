export interface LogInInfo {
    id: number
    username: string
    password: string
    token?: string
    exception?: string
}



export interface UserFormValues {
    username: string
    password: string
}