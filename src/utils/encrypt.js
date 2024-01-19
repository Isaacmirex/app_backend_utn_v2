import CryptoJS from "crypto-js";
import {config} from 'dotenv';

config()

var secretkey = process.env.SECRET_KEY

function cipherPassword (password) {
    var cipherpwd = CryptoJS.AES.encrypt(password, secretkey).toString();
    return cipherpwd
}

function decryptPassword (password) {
    var bytes = CryptoJS.AES.decrypt(password, secretkey);
    var originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    return originalPassword
}

function ComparePasswords (text, cipher) {
    var cipher_pwd = decryptPassword(cipher)
    if (cipher_pwd == text) {
        return true
    }
    else {
        return false
    }
}


function getTableName (module_id) {
    switch (module_id) {
        case 1:
            return "users";
            break;
        case 2:
            return "modules";
            break;
        case 3:
            return "roles";
            break;
        case 4:
            return "events";
            break;
        case 5:
            return "auditing";
            break;
        case 6:
            return "assignments_modules";
            break;
        case 7:
            return "assignments_events";
            break;
        case 8:
            return "class_score";
            break;
        case 9:
            return "classroom";
            break;
        case 10:
            return "assignments_class";
            break;
            return NaN
        default:
            break;
    }
}

function getComponentModuleName (module_name) {
    if (module_name) {
        const palabras = module_name.split(/\s+/);
        const aux = palabras.filter(palabra => palabra.length > 3).join('');
        const mn = aux.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return mn;
    }
    return null
}

function getRoute (module_name) {
    if (module_name) {
        const palabras = module_name.split(/\s+/);
        const aux = palabras.filter(palabra => palabra.length > 3).join('');
        const mn = aux.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return mn.toLowerCase();
    }
    return null
}

function ValidateModuleName (texto) {
    const expresionRegular = /^[a-zA-Z]+$/;
    return expresionRegular.test(texto);
}



export {
    cipherPassword,
    decryptPassword, ComparePasswords, getTableName, getComponentModuleName, getRoute
}