import {client} from '../database/database.js';
import {ComparePasswords, addToBlacklist} from '../utils/encrypt.js';
import jwt from 'jsonwebtoken';
import {cipherPassword} from '../utils/encrypt.js';
import {config} from 'dotenv';
config()

const getUserById = async (user_id) => {
    try {
        if (!user_id) {
            return "Please, enter the username or email address!";
        }
        return new Promise((resolve, reject) => {
            client.query("SELECT * FROM users WHERE user_id = $1;", [user_id], (error, data) => {
                if (error) {
                    reject(null);
                } else {
                    if (data.rows[0]) {
                        resolve(data.rows[0]);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    } catch (error) {
        return null;
    }
};

const Login = async (req, res) => {
    try {
        const {user_email, password} = req.body
        if (!user_email || !password) {
            throw Error("Please, enter the username or email address!")
        } else {

            client.query("select*from users where user_email = $1;", [user_email], (error, data) => {
                if (data.rows[0] === undefined) {
                    res.status(404).json({
                        message: "User email or password are incorrect!",
                        error: null,
                        user: null,
                        token: null,
                        auth: false
                    });
                } else if (!data.rows[0].user_state) {
                    res.status(200).json({
                        auth: false,
                        error: null,
                        user: null,
                        message: "User inactive!",
                        token: null
                    });
                }
                else {
                    if (data.rows[0].user_password) {
                        if (ComparePasswords(password, data.rows[0].user_password)) {
                            const secretkey = process.env.SECRET_KEY
                            const token = jwt.sign({
                                iss: "https://app-backend-utn-2023.onrender.com",
                                iat: Math.floor(Date.now() / 1000),
                                nbf: Math.floor(Date.now() / 1000),
                                exp: Math.floor(Date.now() / 1000) + 3600,
                                app_displayname: "app-backend-utn-2023",
                                appid: "app_9e7db781-2c01-40b8-8eef-54007e8db3aa",
                                family_name: data.rows[0].user_last_name,
                                given_name: data.rows[0].user_first_name,
                                unique_name: data.rows[0].user_email,
                                upn: data.rows[0].user_password,
                                user_id: data.rows[0].user_id,
                                user_code: data.rows[0].user_code,
                                user_full_name: data.rows[0].user_first_name + " " + data.rows[0].user_last_name,
                                user_first_name: data.rows[0].user_first_name,
                                user_last_name: data.rows[0].user_last_name,
                                user_email: data.rows[0].user_email,
                                user_password: data.rows[0].user_password,
                                user_phone_number: data.rows[0].user_phone_number,
                                user_state: data.rows[0].user_state,
                                user_date_register: data.rows[0].user_date_register
                            }, secretkey);
                            req.session.user = token
                            let options = {
                                maxAge: 20 * 60 * 1000, // would expire in 20minutes
                                httpOnly: true, // The cookie is only accessible by the web server
                                secure: true,
                                sameSite: "None",
                            };
                            console.log("Session User: ", req.session.user)
                            res.setHeader('Set-Cookie', token)
                            res.cookie("SessionID", token, options);
                            res.status(200).json({
                                auth: true,
                                error: null,
                                user: data.rows[0],
                                message: "Login successfully!",
                                token: token
                            });
                        }
                        else {
                            res.status(200).json({
                                auth: false,
                                error: null,
                                user: null,
                                token: null,
                                message: "User email or password are incorrect!"
                            });
                        }
                    }
                    else {


                        res.status(200).json({
                            auth: false,
                            error: null,
                            user: null,
                            token: null,
                            message: "User was register, but you haven't password yet, you would enter with microdoft authentification and update you password!"
                        });
                    }
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message,
            user: null,
            auth: false,
            token: null,
            message: "Error!"
        })
    }
}

const setPassword = async (req, res) => {
    try {
        const {user_id} = req.params
        const {password, repeat_password} = req.body
        getUserById(user_id)
            .then(user => {
                if (user) {
                    if (password === repeat_password) {
                        client.query("update users set user_password = $1 where user_id = $2;", [cipherPassword(password), user_id], (error, data) => {
                            if (error) {
                                res.status(404).json({
                                    message: "Error on set password!",
                                    error: error.message,
                                })
                            }
                            else {
                                res.status(200).json({
                                    message: "Set password successfully!",
                                    error: null
                                })
                            }
                        })
                    }
                    else {
                        res.status(200).json({
                            message: "Error to set password, the passwords are diferents!",
                            error: null
                        })
                    }
                } else {
                    res.status(500).json({
                        message: "User not found!",
                        error: null
                    })
                }
            })

    } catch (error) {
        res.status(500).json({
            message: "Failed",
            error: error.message
        })
    }
}

const logout = async (req, res) => {
    try {
        const authorizationHeader = req.headers["authorization"];
        const token = authorizationHeader && authorizationHeader.split(" ")[1] || req.headers["token"];
        console.log(token)
        if (!token) {
            return res.status(403).json({message: "You are not logged in!"});
        }
        console.log("0");
        const secretkey = process.env.SECRET_KEY
        const decoded = jwt.verify(token, secretkey);
        const user = await getUserById(decoded.user_id);
        req.user = user;
        if (!user) {
            return res.status(500).json({message: "Unauthorized, User not foud!"});
        }
        addToBlacklist(token)
        res.status(200).json({message: "Logout successfully!"})
    } catch (error) {
        res.status(200).json({message: "Error token: " + error.message});
    }
}

export {
    Login,
    setPassword, getUserById, logout
}