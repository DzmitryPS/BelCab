import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function forceNotNull<T>(data?: T): T {
    if (data === undefined) {
        throw new Error("data is undefined");
    }
    return data;
}

export const isEmail = (email: string) => email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);