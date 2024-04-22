const header = document.getElementById("header");

function toggleMenu(){
    var menuBtn = document.getElementById("nav-menu");

    if(menuBtn.className === "nav-menu"){
        menuBtn.className += " responsive";
        header.style.backgroundColor = "var(--primary-color)";
    } else {
        menuBtn.className = "nav-menu";
        header.style.backgroundColor = "var(--white-color)";
    }
}

function headerShadow(){
    var scrollBtn = document.getElementById("scroll-btn");
    if(document.documentElement.scrollTop > 50){
        scrollBtn.style.display = "none";
        header.style.boxShadow = "0 1px 6px rgba(0, 0, 0 , 0.1)";
        header.style.height = "70px";
    }else{
        scrollBtn.style.display = "flex";
        header.style.boxShadow = "none";
        header.style.height = "90px";
    }
}

window.onscroll = function(){
    headerShadow();
};