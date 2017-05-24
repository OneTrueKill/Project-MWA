/**
 * Created by Shan on 5/21/2017.
 */

const express = require('express');
const router = express.Router();
const request = require('request');

const url = "http://localhost:3000/Schema?id=";
const wger = "https://wger.de/api/v2/exercise/?language=2&muscles=";


router.get('/', function (req, res, next) {

    let args = {
        request: req,
        response: res,
        routineId: req.query.routeId
    };

    getRoutinePromise(args).then(getAllEx).then(redirectToEdit).catch((e) => rejectData(e));

});

function getRoutinePromise(args) {
    return new Promise((resolve, reject) => {

        request(url + args.routineId, (error, response, body) => {

            if (!error) {
                args.routine = JSON.parse(body);
                resolve(args);
            }
            else {
                args.error = "Could not get the routine";
                reject();
            }

        })

    })

}



function getAllEx(args) {
    return new Promise( (resolve, reject) =>{
        request.get(wger + args.routine[0].muscleId,
            {
                'Content-Type': 'applicationapplication/json'
            }
            , (error, response, body) =>{

            if(!error){

                args.excer = body;
                resolve(args);
            }
            else{
                reject(args);
            }
        })
    })
}

function redirectToEdit(args) {

    let response = args.response;
    let ex = JSON.parse(args.excer);

    response.render('viewRoutine', {

        routine: args.routine[0],
        ex :ex.results

    });
}

function rejectData(e) {
    console.log(e)
}

module.exports = router;
