/**
 * Created by Shan on 5/10/2017.
 */


//const session = require("../app.js").session;
const url = "http://localhost:3000/Users?name=";
const request = require('request');


function doLogin(req, res) {

    let args = {

        name: req.body.username,
        pass: req.body.password,
        request: req,
        response: res,


    };
    createPromise(args)
        .then(dataNotNull)
        .then(passCorrect)
        .then(dataResolved)
        .catch((e) => {
            console.log(e);
            dataReject(args)
        })


}


function createPromise(args) {
    return new Promise((resolve, reject) => {


        let username = args.name;

        request(url + username, (error, response, body) => {


            if (!error && response.statusCode === 200) {
                args.data = body;
                resolve(args);
            }
            else {
                args.error = "Error could not reach the database";
                reject();
            }

        });


    })
}


function dataNotNull(args) {

    args.data = JSON.parse(args.data);
    let jsonData = args.data;

    if (jsonData.length > 0) {
        return args;

    }
    else {
        args.error = "Error account does not exist";
        throw "Error data is null"
    }
}

function passCorrect(args) {

    console.log("Promise 3");

    let jsonData = args.data;

    let pass = jsonData[0]["password"];
    if (pass === args.pass) {

        return args;

    }
    else {
        args.error = "Error password is wrong";
        throw "Error password is wrong"
    }
}


function dataResolved(args) {

    let res = args.response;
    let req = args.request;

    req.session.username = args.name;
    req.session.idUser = args.data[0].id;

    res.redirect('/');


}

function dataReject(args) {


    let res = args.response;

    console.log(args.error);

    res.render('login', {
        title: 'Login page',
        action: 'doLogin',
        buttonText: 'Login',
        errorMessage: args.error
    });

}

module.exports = doLogin;
