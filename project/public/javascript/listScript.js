/**
 * Created by Shan on 5/20/2017.
 */

'use strict';

const gInterface = (function () {

    const readyAll = function () {

        $('.scrollTable').on('click', '.addButton', function (e) {
            e.preventDefault();
            alterList(this.id);
            let $this = $(this);
            $this.toggleClass('added');
            if ($this.hasClass('added')) $this.text('remove');
            else $this.text('add');

        });
        $('#createEx').on('submit', function (e) {

                e.preventDefault();
                sendDataToDb();

            }
        );


    };

    const alterList = function (id) {
        gLogical.alterList(id);

    };

    const sendDataToDb = function () {
        let title = $('#exName').val();
        let id = $('#iNr').val();
        let muscle = $('#name').text();
        let mId = $('#mId').text();
        gLogical.sendDataToDb(title, id, muscle,mId );

    };
    const displayError = function () {
          $('#error').toggleClass('hidden');
    };

    const removeError = function () {
      if(!$('#error').hasClass('hidden')) $('#error').toggleClass('hidden');
    };

    return {
        init: function () {
            readyAll();
        },
        displayError : function () {
            displayError();
        },
        removeError : function () {
            removeError();
        }
    }


})();

const gLogical = (function () {

    let list = [];
    let muscle;

    const alterList = function (id) {
        if (alreadyIn(id)) {
            removeFromList(id);
        }
        else {
            if(list.length <10){
                list.push(id);
            }
            else{
                maxListError();
            }

        }

        console.log(list);
    };

    const maxListError =function () {

        gInterface.displayError();

    };

    const removeFromList = function (id) {
        let index = list.indexOf(id);
        if (index > -1) {
            list.splice(index, 1);
        }
        gInterface.removeError();
    };

    const alreadyIn = function (id) {
        for (let i = 0; i < list.length; i++) {
            if (id === list[i]) {
                return true;
            }
        }
        return false;
    };


    const setMuscle = function (name) {
        muscle = name;
    };

    const sendDataToDb = function (title, id, muscle,mId) {
        let postData = {
            title: title,
            creator: parseInt(id),
            muscle: muscle,
            muscleId: parseInt(mId),
            rating: 0,
            ex: list
        };
        console.log(postData);

        postData = JSON.stringify(postData);
        $.ajax({
            data: postData,
            dataType: "json",
            url: "http://localhost:3000/Schema",
            type: "POST",
            contentType: "application/json; charset=utf-8"
        }).done(function (data) {
            window.location.replace("http://localhost:5000");
        }).fail(function (error) {
            console.log("Failed to send: " + error);
        })

    };


    return {
        alterList: function (id) {
            alterList(id);
        },
        setName: function (name) {
            setMuscle(name);
        },
        sendDataToDb: function (title, id, muscle,mId) {
            sendDataToDb(title, id,muscle,mId);
        }
    }


})();


$(function () {

    console.log("Testing script");
    gInterface.init();

});