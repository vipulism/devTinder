
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
   
    checkAllowedList(Object.keys(req.body), allowdList);

}


const validateProfileUpdae = (req) => {
    const allowdList = ['firstName', 'lastName', 'age', 'gender', 'skills'];
    checkAllowedList(Object.keys(req.body), allowdList);
}

const validatePswdUpdate = (req) => {

    const allowdList = ['password'];

    if(!req.body.password){
        throw new Error(`new password is required!!`);
    }

    checkAllowedList(Object.keys(req.body), allowdList)
}


const checkAllowedList = (values, allowdList) => {

    const notAllowed = values.filter(k => !allowdList.includes(k));

    if(notAllowed.length){
        throw new Error(`"${notAllowed.join(',')}" ${notAllowed.length > 1 ? 'are' : 'is'} not allowed!!`);
    }
}

module.exports = { validateSignup, validateLogin, validateProfileUpdae, validatePswdUpdate, checkAllowedList }