const userAuth = (req, res, next) => {

    const authentication = 'xyzzz';

    if(authentication === 'xyz'){
        next();
    }

    res.send('not allowd')

}

module.exports = { userAuth };