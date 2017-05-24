const express = require('express');
const router = express.Router();
const request = require('request');

const url = "http://localhost:3000/Schema";


router.get('/', function (req, res, next) {


    let args = {
        request: req,
        response: res,
    };

    if (!req.session.username) {
        res.render('indexNotLogged');
    }
    else {
        exPromise(args).then(filterData);
    }
});


function exPromise(args) {
    return new Promise((resolve, reject) => {

            request(url, (error, response, body) => {
                    if (!error) {
                        args.data = body;
                        resolve(args);

                    }
                    else {
                        reject();
                    }

                }
            )
        }
    )
}

function filterData(args) {
    let res = args.response;
    let req = args.request;
    let data = JSON.parse(args.data);


    res.render('index', {
        username: req.session.username,
        feat: data


    });
}

module.exports = router;


