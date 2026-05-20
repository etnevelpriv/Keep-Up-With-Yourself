export interface UserInterface {
    name:string;
    password:string | undefined;
    email:string;
    createdAt: Date;
    verified:boolean;
};