import { ObjectId } from "mongodb";

export interface User {
    _id: ObjectId;
    email: string;
    password: string;
}

export interface UserInput {
    email: string;
    password: string;
}
