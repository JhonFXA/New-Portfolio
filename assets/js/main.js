function toggleMenu(){
    var menuBtn = document.getElementById("nav-menu");

    if(menuBtn.className === "nav-menu"){
        menuBtn.className += " responsive";
    } else {
        menuBtn.className = "nav-menu";
    }
}