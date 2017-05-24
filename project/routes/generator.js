/**
 * Created by Shan on 5/3/2017.
 */
const express = require('express');
const router = express.Router();
const request = require('request');
const url = "https://wger.de/api/v2/exercisecategory/";


router.get('/', function(req, res, next) {

    let args = {
        respone : res,
        request: req,
    };

    getAllSelect(args).then(returnData);




});


function getAllSelect(args) {
    return new Promise((resolve, reject)=>{

        request(url, function (error, response, body) {

            if(!error){
                args.data = body;
                resolve(args);
            }
            else {
                reject();
            }

        })


    })
}

function returnData(args) {

    let response = args.respone;

    let json = JSON.parse(args.data);




    response.render('generator', {

        selectOptions: json.results

    });

}




module.exports = router;
