import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { Request } from "express";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh-token'
){
    constructor(private readonly userService: UserService){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.cookies.Refresh;
            }]),
            secretOrKey: `${process.env.JWT_REFRESH_TOKEN}`,
            passReqToCallCallback: true
        });
    }

    async validate(request: Request, payload: any){
        const id = payload.sub;
        const refreshToken = request.cookies?.Refresh;
        return this.userService.compareRefreshTokens(refreshToken, id);
    }
}