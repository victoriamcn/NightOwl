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
let eventCards = document.querySelector('.events')
let selectedLocation = ""

// GET TicketMaster Events
function getTmEvents() {
    if (!city.value || !inputDate.value) {
        console.log ('Enter city name and date')
        } else {
        if (!isSports.checked && !isMusic.checked && !isArts.checked){
            console.log('Need to add at least one type of event')
        } else {
        console.log(inputDate.value)
        getActivityType()
        let dayAfter = dayjs(inputDate.value).add(1, 'day').format('YYYY-MM-DD')
        console.log(dayAfter)
        let apiTM = 'https://app.ticketmaster.com/discovery/v2/events.json?'+ sports + arts + music  + '&city=' + city.value + '&radius=100&unit=miles' + '&startDateTime='+ inputDate.value + 'T10:00:00Z&endDateTime=' + dayAfter + 'T00:00:00Z&apikey=' + tmKey
        // let apiTM = 'https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US'+ sports + arts + music  + '&city=' + city.value + '&radius=100' + '&localStartDateTime='+ localStart + '&apikey=' + tmKey
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
                eventCards.innerHTML = ""

                if (data.page.totalElements === 0) {
                    console.log('No events found')
                } else {
                    // Fill out Event Cards
                    for (let i=0; i<data._embedded.events.length; i++) {
                        
                        let card = document.createElement('div')
                        card.setAttribute('style', 'border: solid')

                        let eventName = document.createElement('h5')
                        let eventPicture = document.createElement('img')
                        let eventDate = document.createElement('li')
                        let eventLocation = document.createElement('li')
                        let linkToTickets = document.createElement('a')
                        
                        eventName.textContent = data._embedded.events[i].name
                        eventPicture.setAttribute('src', data._embedded.events[i].images[0].url)
                        eventPicture.setAttribute('width', '200px')
                        eventDate.textContent = data._embedded.events[i].dates.start.localDate + ', ' + data._embedded.events[i].dates.start.localTime
                        eventLocation.textContent = data._embedded.events[i]._embedded.venues[0].name
                        linkToTickets.textContent = "Click here to get your tickets"
                        linkToTickets.setAttribute('href', data._embedded.events[i].url)
                        linkToTickets.setAttribute('target', '_blank')

                        let selectBtn = document.createElement('button')
                        selectBtn.textContent = 'Select event!'
                        selectBtn.setAttribute('data-index', i)
                        selectBtn.addEventListener('click', giveLocation)
                        
                        card.append(eventName, eventPicture, eventDate, eventLocation, linkToTickets, selectBtn)
                        eventCards.append(card)
                    }  
                }    
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

function giveLocation(event) {
    let clickedBtn = event.target
    let selectedEventIndex = clickedBtn.getAttribute('data-index')
    selectedLocation = eventCards.children[selectedEventIndex].children[3].textContent
    console.log(selectedLocation)
}
// EVENT Listener
searchBtn.addEventListener('click', getTmEvents)
