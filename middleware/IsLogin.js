export default function isAuthorised(req, res, next) {

    if ( req.session.role) {
        console.log(req.session.role);

        return res.status(200).json({message:true})
    } else {
        res.status(403).json({message:false})
    }

}