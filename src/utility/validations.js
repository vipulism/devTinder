
const validateSignup = (req) => {

    const {firstName, lastName, emailId, password} = req.body;

    if(!password){
        throw new Error('password is required');
    }

    const allowdList = ['firstName', 'lastName', 'emailId', 'password'];
    const notAllowed = Object.keys(req.body).filter(k => !allowdList.includes(k))

    if(notAllowed.length){
        throw new Error(`${notAllowed.join(',')} values not is required`);
    }

}

const validateLogin = (req) => {

    const {emailId, password} = req.body;

    if(!password){
        throw new Error('password is required');
    }

    if(!emailId){
        throw new Error('emailId is required');
    }

    const allowdList = ['emailId', 'password'];
    const notAllowed = Object.keys(req.body).filter(k => !allowdList.includes(k))

    if(notAllowed.length){
        throw new Error(`${notAllowed.join(',')} values not is required in login`);
    }

}


const validateProfileUpdae = (req) => {

    const allowdList = ['firstName', 'lastName', 'age', 'gender', 'skills'];
    const notAllowed = Object.keys(req.body).filter(k => !allowdList.includes(k))

    if(notAllowed.length){
        throw new Error(`Updating values for ${notAllowed.join(',')} ${notAllowed.length > 1 ? 'are' : 'is'} not allowed!!`);
    }
}

const validatePswdUpdate = (req) => {

    const allowdList = ['password'];
    const notAllowed = Object.keys(req.body).filter(k => !allowdList.includes(k));

    if(!req.body.password){
        throw new Error(`new password is required!!`);
    }

    if(notAllowed.length){
        throw new Error(`Updating values for ${notAllowed.join(',')} ${notAllowed.length > 1 ? 'are' : 'is'} not allowed!!`);
    }
}

module.exports = { validateSignup, validateLogin, validateProfileUpdae, validatePswdUpdate }