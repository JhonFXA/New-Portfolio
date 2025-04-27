'use strict'

const header = document.getElementById("header");

function toggleMenu(){
    if(window.innerWidth < 900){
        var menuBtn = document.getElementById("nav-menu");
    
        if(menuBtn.className === "nav-menu"){
            menuBtn.className += " responsive";
            header.style.backgroundColor = "var(--primary-color)";
            document.body.style.overflow = "hidden";
        } else {
            menuBtn.className = "nav-menu";
            header.style.backgroundColor = "var(--white-color)";
            document.body.style.overflow = "auto";
        }
    }
}

function headerShadow(){
    var scrollBtn = document.getElementById("scroll-btn");
    if(document.documentElement.scrollTop > 50){
        scrollBtn.style.display = "none";
        header.style.boxShadow = "0 1px 6px rgba(0, 0, 0 , 0.1)";
    }else{
        scrollBtn.style.display = "flex";
        header.style.boxShadow = "none";
    }
}



window.onscroll = function(){
    headerShadow();
};


// ======== TYPING EFFECT ==========
setTimeout(() => {
    var typingEffect = new Typed(".typedText",{
        strings : ["Desenvolvedor"],
        loop : false,
        typeSpeed : 100,
        backSpeed : 80,
        backDelay : 4000,
    })
}, 1000);




// ======== SCROLL REVEAL ==========

const scrollReveal = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 2000,
    reset: false
})


scrollReveal.reveal('.featured-text-card',{});
scrollReveal.reveal('.featured-name',{delay: 100});
scrollReveal.reveal('.featured-text-info',{delay: 200});
scrollReveal.reveal('.featured-text-btn',{delay: 200});
scrollReveal.reveal('.social-icons',{delay: 200});
scrollReveal.reveal('.featured-image',{delay: 300});
scrollReveal.reveal('.scroll-btn',{delay: 200, origin: 'right'});

scrollReveal.reveal('.top-header',{});
scrollReveal.reveal('.row',{delay: 200});
scrollReveal.reveal('.col',{interval:200});

scrollReveal.reveal('.project-container',{delay: 200});





// ======== CHANGE ACTIVE LINK ==========
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.scrollY;
    sections.forEach(current=>{
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 150;
        const sectionId = current.getAttribute('id');

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector(`.nav-menu ul li a[href*='${sectionId}']`).classList.add('active-link');
        } else {
            document.querySelector(`.nav-menu ul li a[href*='${sectionId}']`).classList.remove('active-link');
        }
    })
}

window.addEventListener('scroll', scrollActive);


// ======== PROJECT SLIDER ==========

const slideWrapper = document.querySelector('[data-slide="wrapper"]');
const slideList = document.querySelector('[data-slide="list"]');
const navPreviousButton = document.querySelector('[data-slide="nav-previous-button"]');
const navNextButton = document.querySelector('[data-slide="nav-next-button"]');
const controlsWrapper = document.querySelector('[data-slide="controls-wrapper"]');
let slideItems = document.querySelectorAll('[data-slide="item"]');
const changeGridButton = document.getElementById('change-grid');
let controlButtons;
let slideInterval;

const state = {
    startingPoint : 0,
    savedPosition : 0,
    currentPoint : 0,
    movement : 0,
    currentSlideIndex : 0,
    autoPlay : true,
    timeInterval : 3000,
    canMove : true
};

function translateSlide({ position }){
    state.savedPosition = position;
    slideList.style.transform = `translateX(${position}px)`;
}

function getCenterPosition({ index }){
    const slideItem = slideItems[index];
    const slideWidth = slideItem.clientWidth;
    const windowWidth = slideWrapper.clientWidth;
    const margin = (windowWidth - slideWidth) / 2;
    const position = margin - (index * slideWidth);
    slideItems.forEach(slide=>{
        if(slide.classList.contains("slide-item-focus"))
            slide.classList.remove("slide-item-focus");
    })
    slideItem.classList.add("slide-item-focus");
    return position;

}

function setVisibleSlide({ index, animate }){
    if(state.canMove){
        if(index === 0 || index === slideItems.length - 1){
            index = state.currentSlideIndex;
        }
        const position = getCenterPosition({index: index});
        state.currentSlideIndex = index;
        slideList.style.transition = animate === true? 'transform .5s' : 'none';
        translateSlide({ position: position });
        activeControlButton({ index });
    }
}

function nextSlide(){
    setVisibleSlide({ index: state.currentSlideIndex + 1, animate: true});
}

function previousSlide(){
    setVisibleSlide({ index: state.currentSlideIndex - 1, animate: true});
}

function createControlButtons(){
    slideItems.forEach(function(){
        const controlButton = document.createElement('button');
        controlButton.className = 'slide-control-button fa-solid fa-circle';
        controlButton.setAttribute('data-slide', 'control-button');
        controlsWrapper.append(controlButton);
    })
}

function activeControlButton({ index }){
    const slideItem = slideItems[index];
    const dataIndex = Number(slideItem.dataset.index);
    const controlButton = controlButtons[dataIndex];
    controlButtons.forEach(function(controlButtonItem){
        controlButtonItem.classList.remove('active');
    })
    if(controlButton) controlButton.classList.add('active');
}

function createSlideClones(){
    const firstSlide = slideItems[0].cloneNode(true);
    const secondSlide = slideItems[1].cloneNode(true);
    const lastSlide = slideItems[slideItems.length - 1].cloneNode(true);
    const penultimateSlide = slideItems[slideItems.length - 2].cloneNode(true);

    firstSlide.classList.add('slide-cloned');
    secondSlide.classList.add('slide-cloned');
    lastSlide.classList.add('slide-cloned');
    penultimateSlide.classList.add('slide-cloned');

    firstSlide.dataset.index = slideItems.length;
    secondSlide.dataset.index = slideItems.length + 1;
    lastSlide.dataset.index = -1;
    penultimateSlide.dataset.index = -2;

    slideList.append(firstSlide);
    slideList.append(secondSlide);
    slideList.prepend(lastSlide);
    slideList.prepend(penultimateSlide);
    slideItems = document.querySelectorAll('[data-slide="item"]');
}

function onMouseDown(event, index){
    if(state.canMove){
        const slideItem = event.currentTarget;
        state.startingPoint = event.clientX;
        state.currentPoint = event.clientX - state.savedPosition;
        state.currentSlideIndex = index;
        slideList.style.transition = 'none';
        slideItem.addEventListener('mousemove', onMouseMove);
    }
}

function onMouseMove(event){
    state.movement = event.clientX - state.startingPoint;
    const position = event.clientX - state.currentPoint;
    translateSlide({ position: position });
}

function onMouseUp(event){
    if(state.canMove){
        const pointsToMove = event.type.includes('touch') ? 50 : 150;
        const slideItem = event.currentTarget;
        if(state.movement < -pointsToMove) {
            nextSlide();
        } else if (state.movement > pointsToMove) {
            previousSlide();
        } else {
            setVisibleSlide({ index: state.currentSlideIndex, animate: true});
        }
    
        slideItem.removeEventListener('mousemove', onMouseMove);
    }
}

function onTouchStart(event, index){
    event.clientX = event.touches[0].clientX;
    onMouseDown(event, index);
    const slideItem = event.currentTarget;
    slideItem.addEventListener('touchmove', onTouchMove);
}
function onTouchMove(event){
    event.clientX = event.touches[0].clientX;
    onMouseMove(event);
}
function onTouchEnd(event){
    onMouseUp(event)
    const slideItem = event.currentTarget;
    slideItem.removeEventListener('touchend', onTouchMove);}

function onControlButtonClick(index){
    setVisibleSlide({ index: index + 2, animate: true});
}

function onSlideListTransitionEnd(){
    const slideItem = slideItems[state.currentSlideIndex];

    if(slideItem.classList.contains('slide-cloned') && Number(slideItem.dataset.index) > 0){
        setVisibleSlide({ index: 2, animate: false });
    }
    if(slideItem.classList.contains('slide-cloned') && Number(slideItem.dataset.index) < 0){
        setVisibleSlide({ index: slideItems.length - 3, animate: false });
    }
}

function setAutoPlay() {
    if(state.autoPlay){
        slideInterval = setInterval(function(){
            setVisibleSlide({ index: state.currentSlideIndex + 1, animate: true});
        },state.timeInterval);
    }
}

function removeSlideClones(){
    const slideClones = document.querySelectorAll(".slide-cloned");
    slideClones.forEach(slideClone => {
        slideList.removeChild(slideClone);
    })
    slideItems = document.querySelectorAll('[data-slide="item"]');
}

function changeGrid() {
    var projectContainer = document.querySelector(".project-container");
    if(slideWrapper.classList.contains("grid")){
        document.querySelectorAll(".slide-item").forEach(slideItem =>{
            slideItem.style.cursor = "default";
        })
        projectContainer.style.background = "#515151";
        projectContainer.style.boxShadow = "inset 0px 0px 20px 20px rgba(0, 0, 0, 0.55)";
        slideWrapper.classList.replace("grid", "slide-wrapper");
        state.canMove = true;
        state.autoPlay = true;
        createSlideClones();
        setVisibleSlide({index: state.currentSlideIndex, animate: true})
        navNextButton.style.display = "block";
        navPreviousButton.style.display = "block";
        controlsWrapper.style.display = "block";
        changeGridButton.querySelector("ion-icon").setAttribute('name', 'grid-outline');
    } else {
        document.querySelectorAll(".slide-item").forEach(slideItem =>{
            slideItem.style.cursor = "pointer";
        })
        projectContainer.style.background = "none";
        projectContainer.style.boxShadow = "none";
        slideWrapper.classList.replace("slide-wrapper", "grid");
        state.canMove = false;
        state.autoPlay = false;
        removeSlideClones();
        translateSlide({position: 0});
        clearInterval(slideInterval);
        slideList.style.transition = 'none';
        navNextButton.style.display = "none";
        navPreviousButton.style.display = "none";
        controlsWrapper.style.display = "none";
        changeGridButton.querySelector("ion-icon").setAttribute('name', 'code-outline');
    }
}


function setListeners() {
    controlButtons = document.querySelectorAll('[data-slide="control-button"]');


    controlButtons.forEach(function(controlButton, index){
        controlButton.addEventListener('click', function(){
            onControlButtonClick(index);
        })
    })

    slideItems.forEach((slideItem, index)=>{
        slideItem.addEventListener('dragstart', event => {
            event.preventDefault();
        });
        slideItem.addEventListener('mousedown', function(event){
            onMouseDown(event, index);
        });
        slideItem.addEventListener('mouseup', onMouseUp);
        // slideItem.addEventListener('touchstart', function(event){
        //     onTouchStart(event, index);
        // });
        // slideItem.addEventListener('touchend', onTouchEnd);

        slideItem.addEventListener('click', ()=>{
            if(slideWrapper.classList.contains("grid")){
                state.currentSlideIndex = Number(slideItem.getAttribute('data-index')) + 2;
                changeGrid();
            }
        })
    });
    
    navNextButton.addEventListener('click', nextSlide);
    navPreviousButton.addEventListener('click', previousSlide);
    slideList.addEventListener('transitionend', onSlideListTransitionEnd);
    
    slideWrapper.addEventListener('mouseenter', function(){
        clearInterval(slideInterval);
    })
    slideWrapper.addEventListener('mouseleave', function(){
        setAutoPlay();
    })
    navNextButton.addEventListener('mouseenter', function(){
        clearInterval(slideInterval);
    })
    navNextButton.addEventListener('mouseleave', function(){
        setAutoPlay();
    })
    navPreviousButton.addEventListener('mouseenter', function(){
        clearInterval(slideInterval);
    })
    navPreviousButton.addEventListener('mouseleave', function(){
        setAutoPlay();
    })


    let resizeTimeout;
    window.addEventListener('resize', function(){
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(function(){
            setVisibleSlide({index: state.currentSlideIndex, animate: true});
        }, 1000);
    })
}

function initSlider({ startAtIndex = 0, autoPlay = true, timeInterval = 3000 }){
    state.autoPlay = autoPlay;
    state.timeInterval = timeInterval;
    createControlButtons();
    createSlideClones();
    setAutoPlay();
    setListeners();
    setVisibleSlide({ index: startAtIndex + 2, animate: true});
}

initSlider({autoPlay: true});

// =========================== CONTACT ==================================
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const submitButton = document.getElementById("submit-button");

function submit(){
    if(nameInput.value === ""){
        nameInput.style.borderColor = "red";
        nameInput.setCustomValidity("Por favor, preencha seu nome.");
    } else {
        nameInput.setCustomValidity("");
    }

    if(emailInput.value === ""){
        email.style.borderColor = "red";
        emailInput.setCustomValidity("Por favor, preencha seu e-mail.");
    } else {
        emailInput.setCustomValidity("");
    }

    if(messageInput.value === ""){
        message.style.borderColor = "red";
        messageInput.setCustomValidity("Por favor, digite algo.");
    } else {
        messageInput.setCustomValidity("");
    }

    setTimeout(() => {
        nameInput.style.borderColor = "#aaa";
        emailInput.style.borderColor = "#aaa";
        messageInput.style.borderColor = "#aaa";
    }, 3000);
}

submitButton.addEventListener("click", submit);