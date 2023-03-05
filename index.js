// VARIABLES
let tmKey = '52tbHGA46ZppYQ6Ebczvm7Ql16dl2fGD'
let city = document.querySelector('#inputCity')
let isMusic = document.querySelector('#music')
let isSports = document.querySelector('#sports')
let isArts = document.querySelector('#arts')
let searchBtn = document.querySelector('#searchBtn')
let inputDate = document.querySelector('#inputDate')
let sports = ""
let arts= ""
let music= ""

// GET TicketMaster Events
function getTmEvents() {
    if (!city.value || !inputDate.value) {
        console.log ('Enter city name and date')
        } else {
        if (!isSports.checked && !isMusic.checked && !isArts.checked){
            console.log('Need to add at least one type of event')
        } else {
        console.log(inputDate.value, )
        getActivityType()
        let dayBefore = dayjs(inputDate.value).subtract(1, 'day').format('YYYY-MM-DD')
        let dayAfter = dayjs(inputDate.value).add(1, 'day').format('YYYY-MM-DD')
        console.log(dayBefore, dayAfter)
        let apiTM = 'https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US'+ sports + arts + music  + '&city=' + city.value + '&radius=100&unit=miles' + '&startDateTime='+ dayBefore + 'T23:59:59Z&endDateTime=' + dayAfter + 'T00:00:00Z&apikey=' + tmKey
        fetch(apiTM)
            .then(function(response) {
                if (!response.ok) {
                    throw response.json();
                }
                return response.json()
                console.log(response.status)
            })
            .then(function(data) {
                console.log('data', data)
                sports = ""
                arts = ""
                music = ""
            })
        }
    }
}

// ACTIVITY type requested by user
function getActivityType() {
    if (isSports.checked) {
        sports ='&classificationName=sports'
    } 
    if(isArts.checked) {
        arts ='&classificationName=arts&theatre'
    }
    if(isMusic.checked) {
        music ='&classificationName=music'
    }
}

// EVENT Listener
searchBtn.addEventListener('click', getTmEvents)
