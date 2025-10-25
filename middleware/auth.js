export function isAdmin(req, res, next) {

    if (req.session.role === "admin") {
        console.log(req.session.role);

        return next()
    } else {
        res.status(403).json("this page is foridden for users")
    }

}




export function isUser(req, res, next) {

    if (req.session.role === "user") {
        console.log(req.session.role);

        return next()
    } else {
        res.status(403).json("this page is only for users")
    }

}