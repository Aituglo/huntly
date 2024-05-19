import { TOTP } from "totp-generator"
import prisma from "@/lib/prisma";

export default class YesWeHack {
  static async getFullJWT(email: string, password: string, totp: string) {
    const login = await fetch('https://api.yeswehack.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    });

    const loginResponse = await login.json();

    if (loginResponse.token) {
      return loginResponse.token;
    } else if (loginResponse.totp_token) {
      if (totp) {
        const { otp } = TOTP.generate(totp)
        const totpLogin = await fetch('https://api.yeswehack.com/account/totp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'token': loginResponse.totp_token,
            'code': otp
          }),
        });
        const totpLoginResponse = await totpLogin.json();
        if (totpLoginResponse.token) {
          return totpLoginResponse.token;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    } 
  }

  static async getJWT(userId: string) {
    const platform = await prisma.platform.findFirst({
      where: {
        userId: userId,
        slug: 'yeswehack'
      }
    });

    if (!platform) {
      return null;
    }


    if (platform.jwt && platform.jwt !== '' && (Date.now() - new Date(platform.updatedAt).getTime()) <= 3500000){
      return platform.jwt;
    }

    const jwt = await this.getFullJWT(platform.email, platform.password, platform.otp);
    if (jwt) {
      await prisma.platform.update({
        where: {
          id: platform.id
        },
        data: {
          jwt: jwt
        }
      });
    }
    return jwt;
  }

  static async getUsername(userId: string){
    const jwt = await this.getJWT(userId);
    if (!jwt) {
      return null;
    }

    const userReq = await fetch('https://api.yeswehack.com/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`
      },
    });
    const userResp = await userReq.json();
    return userResp.username;
  }
}