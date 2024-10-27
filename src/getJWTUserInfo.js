import { cookies } from "next/headers";
import { TWO_FACTOR_AUTHENTICATION } from "./server_veriables/constants";
import { verify } from "jsonwebtoken";

export const getJWTUserInfo = () => {
    try {
        const jwt_secret = process.env.JWT_SECRET || "";
        const tocken = cookies().get(TWO_FACTOR_AUTHENTICATION)?.value;
        const user = verify(tocken , jwt_secret);
        return user;
    } catch(error) {
        return null;
    }
}