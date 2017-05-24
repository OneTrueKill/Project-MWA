/**
 * Created by Shan on 5/20/2017.
 */

const url = "http://localhost:3000/Users?name=";
const request = require('request');
const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {

    let args = {
        name: req.session.username,
        request: req,
        response: res,
    };
    if (!req.session.username) {
        res.render('notLogged');
    }
    else {
        alterAccountPromise(args).then(redirect);
    }

});

function alterAccountPromise(args) {
    return new Promise((resolve, reject) => {

        request(url + args.name, (error, response, body) => {

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

function redirect(args) {

    let response = args.response;
    let data = JSON.parse(args.data);
    response.render('account', {
        data: data[0]
    });
}

module.exports = router;
