import bcrypt from "bcrypt";

export async function hashPass(password){
    const salt = 10
    return await bcrypt.hash(password, salt)
}

export async function verifyPass(password, hashedPassword){
    return await bcrypt.compare(password, hashedPassword)
}