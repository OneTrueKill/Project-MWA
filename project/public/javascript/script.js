/**
 * Created by Shan on 5/19/2017.
 */

let swRegistration = null;
let isSubscribed = false;
const button = $("#subButton");
const key = "BOwNJB9-OV18vkGNdlmEXT7r6vhw2tR0YKTTKlPU0wA97iHPugDofxPPcDIt6y6KsbtksfUmTrEnZVKHT1_ryps";


function register() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {

        navigator.serviceWorker.register('/sw.js', {scope: '/'})
            .then(function (registration) {
                console.log('ServiceWorker registration successful with scope: ', registration);
                console.log("Push is supported");
                swRegistration = registration;
                initialiseUI();

            }).catch(function (err) {
            console.log('ServiceWorker registration failed: ', err);
        })
    }
    else {
        console.warn("PushNotifications not supported");
    }
}


function initialiseUI() {

    button.on('click', function () {
        button.attr("disabled", true);
        if (!isSubscribed) subUser();


    });

    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            isSubscribed = !(subscription === null);

            if (isSubscribed) {
                console.log("User is subbed");
            }
            else {
                console.log("user is not subbed");
            }
            updateBtn();
        })
}

function updateBtn() {
    if(Notification.permission === 'denied'){
        button.text("Push messaging blocked");
        button.attr("disabled", true);

        return;
    }


    if (isSubscribed) {
        button.text("Push messaging is enabled");
        button.attr("disabled", true);
    }
    else {
        button.text("Enable push messaging");
        button.attr("disabled", false);
    }


}


function subUser() {

    const appKey = urlB64ToUint8Array(key);
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: appKey
    })
        .then(function (subscription) {
            console.log("User is subbed");

            isSubscribed = true;
            updateBtn()
        })
        .catch(function (error) {
            console.log("Failed to sub the user: ",error);
            updateBtn();
        });
}





function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


register();

