import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // jwtFromRequest: (req) => {
            //     if(!req || !req.cookies){
            //         return null;
            //     }
            //     return req.cookies['authcookie'];
            // },
            ignoreExpiration: false,
            secretOrKey: `${process.env.JWT_SECRET}`
        });
    }

    async validate(payload: any){
        return { id: payload.sub };
    }
}