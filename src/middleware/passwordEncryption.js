const bcrypt = require('bcrypt');
const { SALT } = require('../common/Config');

const encryptPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, SALT).then(function (hash) {
            resolve(hash)
        });
    })
}

module.exports=encryptPassword;