/**
 * Created by Shan on 5/20/2017.
 */

const url = "http://localhost:3000/Users/";
const request = require('request');

function changeAccount(req, res) {

    let args = {
        id: parseInt(req.body.idNr),
        email: req.body.email,
        name: req.body.name,
        pass: req.body.pass,
        request: req,
        response: res

    };

    changePromise(args).then(succesChange).catch((e) => {
        console.log("Could not change error: ", e);
        errorChange(args);
    })
}

function changePromise(args) {
    return new Promise((resolve, reject) => {


        console.log(url + args.id);

        request.patch(url + args.id,
            {
                json: {
                    Email: args.email,
                    name: args.name,
                    password: args.pass
                }
            }, function (err, httpResponse, body) {
                if (!err) {
                    args.error = "data has been changed";
                    resolve(args);
                }
                else {
                    console.log(err);
                    args.error = "Could not change the data";
                    reject();
                }

            });


    })
}


function errorChange(args) {

    let response = args.response;

    let data = {
        id: args.id,
        email: args.email,
        name: args.name,
        pass: args.pass,

    };
    response.render('account', {
        data: data,
        error: args.error

    });
}

function succesChange(args) {
    console.log("Changes made");
    let response = args.response;
    let request = args.request;

    request.session.username = args.name;

    response.render('changeMade', {
        error: args.error
    })
}

module.exports = changeAccount;