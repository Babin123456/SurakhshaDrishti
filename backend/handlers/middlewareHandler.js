const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const rate_limiter = require('express-rate-limit')

const API_Limiter = (window_seconds, rate_count, logger) => rate_limiter({
    windowMs: window_seconds * 1000,
    max: rate_count,
    message: {
        sucess: false,
        status: 429,
        error: `Too many requests from this IP, please try again later.`
    }, standardHeaders:true,
    skipSuccessfulRequests: logger === 1 ? true : false,
    legacyHeaders:false,
});

const FN_verifyTkn = (req, res, next) =>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        res.statusCode = 401;
        return next(new Error("Unauthorized User Access! Please login"));
    }

    try{
        const verifyTkn = jwt.verify(token, process.env.JWT_SECRET || 'suraksha_secret_jwt_2026_production');
        req.user = verifyTkn; //this adds a new section to the json called user which has jwt contents
        next();
    }catch(err){
        res.statusCode = 403;
        next(new Error("Invalid or Expiered token for session, please re Login..."))
    }
    
};


const handle404 = (req, res, next) => {
    res.status(404);
    
    const error = new Error(`NOT FOUND : ${req.originalUrl}`);
    next(error); //sending error to next function
}

const masterErrorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    console.log("Error: ", statusCode);
    res.status(statusCode).json({
        sucess: false,
        status: statusCode,
        error: err.message ||"Internal Server Error"
    });
};

module.exports = {handle404, masterErrorHandler, FN_verifyTkn, API_Limiter}