/**
 * Created by Shan on 5/20/2017.
 */

function logout(req, res) {

    req.session.destroy();
    res.redirect('/')

}

module.exports= logout;