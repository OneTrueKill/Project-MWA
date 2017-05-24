/**
 * Created by Shan on 5/18/2017.
 */

const request = require('request');
const url = "https://wger.de/api/v2/exercise/?language=2&muscles=";
const urlName = "https://wger.de/api/v2/exercisecategory/";


function generate(req, res) {

    let args = {

        response: res,
        request: req,
        search: req.body.muscle
    };


    exercisePromise(args).then(getName).then(displayResults).catch((e) => {
        args.error = e;
    })

    //res.send("Ready");
    //res.send(JSON.stringify(args));

}


function exercisePromise(args) {
    return new Promise((resolve, reject) => {
        request(url + args.search, (error, response, body) => {


            console.log(url + args.search);
            if (!error) {
                args.data = body;
                resolve(args);
            }
            else {
                args.error = "Could not reach the database, try again later";
                reject();
            }

        })
    })

}
function getName(args) {
    return new Promise((resolve, reject) => {
        request(urlName, (error, response, body) => {
            let names = JSON.parse(body);
            for (let i = 0; i < names.results.length; i++) {

                if (args.search == names.results[i].id) {
                    args.muscle = names.results[i].name;
                    resolve(args);
                }
            }
            reject();
        })
    })
}

function displayResults(args) {

    let response = args.response;
    let request = args.request;
    let data = JSON.parse(args.data);


    response.render('generated', {
        name: args.muscle,
        mId: args.search,
        id: request.session.idUser,
        data: data.results
    })


}


module.exports = generate;