// VARIABLES
let tmKey = '52tbHGA46ZppYQ6Ebczvm7Ql16dl2fGD'
let city = document.querySelector('#inputCity')
let isMusic = document.querySelector('#music')
let isSports = document.querySelector('#sports')
let isArts = document.querySelector('#arts')
let searchBtn = document.querySelector('#searchBtn')
let inputDate = document.querySelector('#inputDate')
let ticketmasterOptions = document.querySelector('.tm-options')
let header = document.querySelector('.header')
let sports = ""
let arts= ""
let music= ""
let eventCards = document.querySelector('.events')
let venueLat = []
let venueLon = []
let selectedLat = ""
let selectedLog = ""

// GET TicketMaster Events
function getTmEvents() {
    if (!city.value || !inputDate.value) {
        console.log ('CREATE MODAL: Enter city name and date')
        } else {
        if (!isSports.checked && !isMusic.checked && !isArts.checked){
            console.log('CREATE MODAL: Please add at least one type of event')
        } else {
        console.log(inputDate.value)
        getActivityType()
        let dayAfter = dayjs(inputDate.value).add(1, 'day').format('YYYY-MM-DD')
        console.log(dayAfter)
        let apiTM = 'https://app.ticketmaster.com/discovery/v2/events.json?'+ sports + arts + music  + '&city=' + city.value + '&radius=100&unit=miles' + '&startDateTime='+ inputDate.value + 'T10:00:00Z&endDateTime=' + dayAfter + 'T00:00:00Z&apikey=' + tmKey
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
                venueLat = []
                venueLon = []
                if (data.page.totalElements === 0) {
                    console.log('CREATE MODAL: No events found')
                } else {
                    // Fill out Event Cards
                    for (let i=0; i<data._embedded.events.length; i++) {
                        printEvents(data._embedded.events[i])
                        eventCards.children[i].setAttribute('data-index', i)
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

// PRINT TicketMaster Events
function printEvents(eventsFound) {
    console.log(eventsFound)
    let card = document.createElement('div')
    card.setAttribute('style', 'border: solid')
    let eventName = document.createElement('h5')
    let eventPicture = document.createElement('img')
    let eventDate = document.createElement('li')
    let eventLocation = document.createElement('li')
    let linkToTickets = document.createElement('a')
                        
    eventName.textContent = eventsFound.name
    eventPicture.setAttribute('src', eventsFound.images[0].url)
    eventPicture.setAttribute('width', '200px')
    eventDate.textContent = eventsFound.dates.start.localDate + ', ' + eventsFound.dates.start.localTime
    eventLocation.textContent = eventsFound.name
    linkToTickets.textContent = "Click here to get your tickets"
    linkToTickets.setAttribute('href', eventsFound.url)
    linkToTickets.setAttribute('target', '_blank')

    venueLat.push(eventsFound._embedded.venues[0].location.latitude)
    venueLon.push(eventsFound._embedded.venues[0].location.longitude)
    console.log(venueLat,venueLon)
    
    let selectBtn = document.createElement('button')
    selectBtn.textContent = 'Select event!'
    selectBtn.addEventListener('click', giveLocation)
    card.append(eventName, eventPicture, eventDate, eventLocation, linkToTickets, selectBtn)
    eventCards.append(card)          
}

function giveLocation(event) {
    let clickedBtn = event.target
    let selectedElementDiv = clickedBtn.parentElement
    selectedElementDiv.classList.add('selectedEvent')
    let dataIndexSelectedEvent = selectedElementDiv.getAttribute('data-index')
    console.log(dataIndexSelectedEvent)
    // Selected event venue lat and long to input in restaurants API
    selectedLat = venueLat[dataIndexSelectedEvent]
    selectedLog = venueLon[dataIndexSelectedEvent]
    console.log(selectedLat,selectedLog)
    // DELETE unselected events
    for (let i=0; i < eventCards.children.length; i++) {
        console.log(eventCards.children[i].getAttribute('data-index'))
        if (eventCards.children[i].getAttribute('data-index') !== dataIndexSelectedEvent) {
            // eventCards.children[i].innerHTML = ""
            eventCards.children[i].style.display = "none"
        }
    }

    // hide ticketmaster options and 'select event' button
    ticketmasterOptions.classList.add('hidden')
    selectedElementDiv.children[5].classList.add('hidden')

    // Create START over button
    let startOverBtn = document.createElement('button')
    startOverBtn.innerText = 'Start Over'
    header.append(startOverBtn)
    startOverBtn.addEventListener('click', function() {
        window.location.reload()
    })

    restaurantSearch()
}

function restaurantSearch() {
    let localBusinessAPI = 'https://local-business-data.p.rapidapi.com/search-in-area?query=restaurant&lat=' + selectedLat + '&lng=' + selectedLog + '&zoom=10&limit=10&language=en'

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '1ec3590d92mshe2db421ebc47e2dp11e3fbjsn51804c2778b9',
            'X-RapidAPI-Host': 'local-business-data.p.rapidapi.com'
        }
    };

    fetch(localBusinessAPI, options)
        .then(function(response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json()
            console.log(response.status)
        })
        .then(function(data) {
            console.log('data', data)
        })

}

// EVENT Listener
searchBtn.addEventListener('click', getTmEvents)
