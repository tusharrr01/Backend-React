import jwt from 'jsonwebtoken';

const JWT_SECRET = 'error';

const fetchuser = (req,res,next)=>{
    // get user from the jwt token and add id to req object 
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: "please authenticate using correct token"});
    }
    try {
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        next();
        
    } catch (error) {
        res.status(401).send({error: "please authenticate using correct token"})
    }
}

export default fetchuser