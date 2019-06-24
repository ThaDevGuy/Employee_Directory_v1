//Variables
let data;
let resultsHtml = '<p class="no-results"> There are no employees list returned</p>';
const resultsDiv = document.querySelector('.results');
const header = document.querySelector('header');
const inputHTML = `<input type="text" name="search" id="search-input">`;
header.insertAdjacentHTML('beforeend', inputHTML);
const searchInput = document.querySelector('#search-input');
const modalDiv = document.querySelector('.modal');
let  cards;
const  closeBTN  = document.querySelector('.btn-close');
const  leftBTN  = document.querySelector('.btn-left');
const  rightBTN  = document.querySelector('.btn-right');

fetch('https://randomuser.me/api/?nat=us,gb&results=12&exc=registered,nat,gender,phone')
    .then (response => checkStatus(response))
    .then(response => response.json())
    .then(response => data = getData(response.results))
    .then(() => generateCardsHTML(data))
    .catch(error => console.log('Looks like there\'s an error', error))
    .finally(() => {
        resultsDiv.insertAdjacentHTML('beforeend', resultsHtml);
        cards = document.querySelectorAll('.card');
    });





//Events
searchInput.addEventListener('keyup', searchData);
document.addEventListener('click', modalview);
closeBTN.addEventListener('click', closeModal);
leftBTN.addEventListener('click', showPrev);
rightBTN.addEventListener('click', showNext);
document.addEventListener('keyup', closeModal);
document.addEventListener('keyup', (e) => {
    showNext(e);
    showPrev(e);
});






//Helper Functions
function getData (response) {
    return JSON.parse(JSON.stringify(response));
}


function checkStatus (response) {
    if(response.ok) {
        return Promise.resolve(response);
    }
    else {
        return Promise.reject(new Error(response.statusText));
    }
}

function  generateCardsHTML () {
    resultsHtml = '';
    data.forEach(employee => {
        resultsHtml += `<div class="card">
        <img src="${employee.picture.medium}" alt="photo of employee">
        <div class="info">
            <h2 class="name">${employee.name.first} ${employee.name.last}</h2>
            <p class="email">${employee.email}<a href="mailto:${employee.email}"></a></p>
            <span class="city">
            ${employee.location.city} 
            </span>
        </div>
    </div>`
    });
}


function searchData () {
    hideAllElement(cards);
    if(searchInput.value.length >= 0){
        data.forEach((employee, i) => {
            const username = employee.login.username;
            const name = `${employee.name.first} ${employee.name.last}`;
            if(username.includes(searchInput.value) || name.includes(searchInput.value)) {
                cards[i].style.display = '';
            }
            else {
                cards[i].style.display = 'none';
            }
        });
    }
}

function hideAllElement(collection) {
    for(let i = 0; i < collection.length; i++) {
        collection[i].style.display = 'none';
    }
}

let modalIndex;
function modalview (eventTarget) {
    if(!isElement(eventTarget)) {
        eventTarget =  eventTarget.target;
    }
    if(eventTarget.matches('.card')) {
        modalDiv.parentNode.style.display = 'none';
        const modalViewDiv = document.querySelector('.modal-view');
        if(modalViewDiv) {
            modalViewDiv.remove();
        }
        modalIndex = Array.prototype.indexOf.call(cards, eventTarget);
        modalDiv.insertAdjacentHTML('beforeend', generateModalHtml(modalIndex));
        const modalImg = document.querySelector('.modal img');
        modalImg.onload = function () {
            modalDiv.parentNode.style.display = 'block';
        }
    }
}

function generateModalHtml (index) {
    const modalHtml = `
    <div class="modal-view">
        <img src="${data[index].picture.large}" alt="photo of employee">
        <div class="info">
            <h2 class="name">${data[index].name.first} ${data[index].name.last}</h2>
            <p class="email">${data[index].email}<a href="mailto:${data[index].email}"></a></p>
            <span class="city">
            ${data[index].location.city} 
            </span>
        </div>
        <hr>
        <div class="detail-info">
            <p class="phone"><a href="tel:${data[index].cell}">${data[index].cell}</a></p>
            <p class="address">${data[index].location.street} ${data[index].location.city} ${data[index].location.postcode}</p>
            <p class="dob">Birthday: ${formatDateString(data[index].dob.date)}</p>
        </div>
    </div>`
    return modalHtml;
}

function closeModal (e) {
    if(e.keyCode) {
        if(e.keyCode !== 27) return;
    }
    if(modalDiv.parentNode.style.display = 'block')
        modalDiv.parentNode.style.display = 'none';
}

function showNext (e)  {
    if(modalDiv.parentNode.style.display === 'none') return;
    if(e.keyCode) {
        if(e.keyCode !== 39) return;
    }
    if(modalIndex < cards.length - 1) {
        modalIndex++;
    }
    else {
        modalIndex = 0;
    }
    const target = cards[modalIndex];
    modalview(target);
}

function showPrev (e)  {
    if(modalDiv.parentNode.style.display === 'none') return;
    if(e.keyCode) {
        if(e.keyCode !== 37) return;
    }
    if(modalIndex > 0) {
        modalIndex--;
    }
    else {
        modalIndex = cards.length - 1;
    }
    const target = cards[modalIndex];
    modalview(target);
}

function formatDateString(dateString) {
    const firstIndexOfT = dateString.indexOf('T');
    return dateString.slice(0, firstIndexOfT);
}

function isElement(element) {
    return element instanceof Element || element instanceof HTMLDocument;  
}