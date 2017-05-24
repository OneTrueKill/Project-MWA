/**
 * Created by Shan on 5/17/2017.
 */

const url = "http://localhost:3000/Users";

const nameQuery = "?name=";
const mailQuery = "?Email=";

const request = require("request");

function doRegister(req, res) {


    let args = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        request: req,
        response: res
    };


    nameExistPromise(args)
        .then(dataExist)
        .then(emailExist)
        .then(dataExist)
        .then(createAccount)
        .then(indexRedirect)
        .catch((e) => {
            console.log(e);
            errorRedirect(args)
        })

}


function nameExistPromise(args) {

    return new Promise((resolve, reject) => {

        request(url + nameQuery + args.username, (error, response, body) => {

            if (!error && response.statusCode === 200) {
                args.data = body;
                args.error = "Username already taken";
                resolve(args);
            }
            else {
                reject();
            }

        })
    })
}

function emailExist(args) {

    return new Promise((resolve, reject) => {
        request(url + mailQuery + args.email, (error, response, body) => {
            if (!error && response.statusCode === 200) {

                args.data = body;
                console.log(body);
                args.error = "Email is already registerd";
                resolve(args);
            }
            else {
                reject();
            }

        })
    })
}

function dataExist(args) {
    args.data = JSON.parse(args.data);
    let jsonData = args.data;
    console.log(jsonData);

    if (jsonData.length === 0)return args;
    else throw "Error data is not null"
}

function createAccount(args) {

    return new Promise((resolve, reject) => {

        request.post(url,
            {
                json: {
                    Email: args.email,
                    name: args.username,
                    password: args.password
                }
            },
            function (err, httpResponse, body) {

                if (err) {
                    console.log(err);
                    args.error = "Could not create account";
                    reject(args);
                }
                else {
                    args.id = body.id;
                    resolve(args);
                }

            });

    });


}

function indexRedirect(args) {

    console.log("Redirect to index");
    let respose = args.response;
    let request = args.request;

    request.session.username = args.username;
    request.session.idUser = args.id;

    respose.redirect("/");

}

function errorRedirect(args) {

    let respose = args.response;
    respose.render('register', {
        title: 'Register page',
        action: 'doRegister',
        buttonText: 'register',
        loginLink: '/login',
        errorMessage: args.error,

    });

}

module.exports = doRegister;