import { IUser } from 'interfaces'
import jwt from 'jsonwebtoken'
import { queryVault } from './apivault'

export const sign =  async (data: IUser ) => {
    const keys: any =  await queryVault("/v1/kv/rsa")
    return jwt.sign(JSON.stringify(data), keys.private, { algorithm: 'RS256' })
}