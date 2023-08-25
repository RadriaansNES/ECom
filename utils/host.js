$(document).ready(function () {
    // Get the form element
    const form = $("#checkout-form");

    // Set the action attribute based on the PORT value
    if (typeof PORT !== 'undefined' && PORT === 4242) {
        form.attr("action", "http://localhost:4242/create-checkout-session");
    } else {
        form.attr("action", "https://ecom-server-5e1g.onrender.com/create-checkout-session");
    }
});