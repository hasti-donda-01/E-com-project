import jwt from 'jsonwebtoken'

export const auth = (role) => (req, res, next) => {
    try {
        const a = req.get('Authorization');

        if (!a) {
            return res.status(400).json({
                success: false,
                message: "Token Required"
            })
        }
        const token = a.split(' ')[1];
        console.log(token, "token");
        const decode = jwt.verify(token, process.env.PRIVATEKEY);
        req.user = decode
        console.log(decode,"decode")
        console.log(decode.role, "decode");
        if (!role.includes(decode.role))

            return res.status(400).json({
                success: false,
                message: 'anauthorized user'
            })
        // console.log(decode, "decode")

        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


