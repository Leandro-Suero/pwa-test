document.addEventListener("DOMContentLoaded", function() {
    const options = [];
    //sidenav element
    var elems = document.querySelectorAll(".sidenav");
    var instances = M.Sidenav.init(elems, options);

    //modal elements
    var elems = document.querySelectorAll(".modal");
    var instances = M.Modal.init(elems, options);
});
