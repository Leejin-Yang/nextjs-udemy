import { compare, hash } from 'bcryptjs'

// 비밀번호 암호화
export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, 12)
  return hashedPassword
}

// 비밀번호 비교
export async function verifyPassword(password: string, hashedPassword: string) {
  const isValid = await compare(password, hashedPassword)
  return isValid
}
