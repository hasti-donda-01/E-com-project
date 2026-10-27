import jwt from 'jsonwebtoken'
import { User } from '../models/user.js';
import { Customer } from '../models/customer.js';

export const auth = (role) => async (req, res, next) => {
    try {
        const authorization = req.get('Authorization');
        const cookieToken = req.headers.cookie
            ?.split(';')
            .map((cookie) => cookie.trim())
            .find((cookie) => cookie.startsWith('AccessToken='))
            ?.slice('AccessToken='.length);
        const token = authorization
            ? authorization.startsWith('Bearer ')
                ? authorization.slice('Bearer '.length)
                : null
            : cookieToken;
        const authenticatedByCookie = !authorization && Boolean(cookieToken);

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token Required"
            })
        }

        if (authenticatedByCookie && !["GET", "HEAD", "OPTIONS"].includes(req.method)) {
            const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173,http://localhost:5174")
                .split(",")
                .map((origin) => origin.trim())
                .filter(Boolean);
            const origin = req.get("Origin") || "";
            const isVercel = origin.endsWith('.vercel.app');
            if (!allowedOrigins.includes(origin) && !isVercel) {
                return res.status(403).json({
                    success: false,
                    message: "Request origin is not allowed"
                });
            }
        }

        const decode = jwt.verify(token, process.env.PRIVATEKEY);
        const isCustomerToken = String(decode.role).toLowerCase() === 'customer';
        let user = isCustomerToken
            ? await Customer.findById(decode.id)
            : await User.findById(decode.id);
        if (!user && isCustomerToken) user = await User.findById(decode.id);
        if (!user) {
            return res.status(404).json({
                message: "user not found",
                success: false
            })
        }
        if (user.isActive === false || user.status === 'blocked') {
            return res.status(403).json({
                message: "Your account is blocked. Please contact admin.",
                success: false
            })
        }
        req.user = user
        req.authRole = decode.role || user.role;
        const allowed = [].concat(role).map(r => r.toLowerCase());
        if (!allowed.includes(String(req.authRole).toLowerCase())) {
            return res.status(403).json({
                success: false,
                message: `This account does not have the required role: ${allowed.join(" or ")}`
            })
        }
        // console.log(decode, "decode")

        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}
