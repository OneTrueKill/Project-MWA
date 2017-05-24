const express = require('express');
const router = express.Router();
const request = require('request');
const url = "http://localhost:3000/Schema?creator=";

router.get('/', function (req, res, next) {

    if (!req.session.username) {
        res.render('notLogged');
    }
    else {

        let args = {
            request: req,
            respone: res,
            username: req.session.username,
            id: req.session.idUser
        };

        console.log(args);
        getRoutinesPromise(args).then(resolveData).catch((e) =>{rejectData(args)});
    }
});

function getRoutinesPromise(args) {

    return new Promise((resolve, reject) => {
        request(url + args.id, (error, response, body) => {

            if (!error) {
                args.routines = body;
                resolve(args);
            }
            else {
                console.log("rejecting");
                reject();
            }

        })
    })

}


function resolveData(args) {
    let response = args.respone;
    let data = JSON.parse(args.routines);

    //response.send(data[0].title);
    response.render('routines', {
        username: args.username,
        routines: data
    });
}

function rejectData(args) {
    args.error = "Error could not get routines";
    console.log(args.error);
}


module.exports = router;
