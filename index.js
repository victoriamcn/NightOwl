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
let modalEl = document.querySelector('.modal')
let closeModalBtn = document.querySelectorAll('.close-modal')
let modalText = document.querySelector('.modal-body')
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
        modalText.textContent = 'Please, enter city AND date'
        modalEl.classList.remove('hidden')
        } else {
        if (!isSports.checked && !isMusic.checked && !isArts.checked){
            modalText.textContent = 'Please add at least one type of event'
            modalEl.classList.remove('hidden')
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
                    modalText.textContent = 'No events were found, please try again!'
                    modalEl.classList.remove('hidden')
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
    // card.setAttribute('style', 'border: solid')
    eventCards.classList.add('flex', 'flex-row', 'flex-wrap', 'gap-10', 'justify-items-center', 'justify-evenly', 'md:flex-column', 'md:justify-items-center', 'sm:flex-column', 'sm:justify-items-center')
    card.classList.add('flex', 'flex-col', 'gap-4', 'items-center', 'p-3', 'rounded-lg', 'w-2/5', 'cards-border')
    let eventName = document.createElement('h4')
    eventName.classList.add('bg-white', '-mt-8', 'p-3', 'text-lg', 'font-bold', 'text-center')
    let eventPicture = document.createElement('img')
    eventPicture.classList.add('rounded-lg')
    let eventDate = document.createElement('li')
    let eventLocation = document.createElement('li')
    let linkToTickets = document.createElement('a')
                        
    eventName.textContent = eventsFound.name
    eventPicture.setAttribute('src', eventsFound.images[0].url)
    eventPicture.setAttribute('width', '200px')
    let eventLocalTime = dayjs(eventsFound.dates.start.localDate + ', '+ eventsFound.dates.start.localTime).format('MMM DD, YYYY [at] hh:mm a')
    console.log(eventLocalTime)
    eventDate.innerHTML = '<span class="material-symbols-outlined">event    </span>' + eventLocalTime
    eventLocation.innerHTML = '<span class="material-symbols-outlined">location_on  </span>' + eventsFound._embedded.venues[0].name
    linkToTickets.textContent = "Click here to get your tickets"
    linkToTickets.setAttribute('href', eventsFound.url)
    linkToTickets.setAttribute('target', '_blank')
    linkToTickets.classList.add('underline', 'hover:no-underline')

    venueLat.push(eventsFound._embedded.venues[0].location.latitude)
    venueLon.push(eventsFound._embedded.venues[0].location.longitude)
    
    let selectBtn = document.createElement('button')
    selectBtn.textContent = 'Select event!'
    selectBtn.classList.add('px-6', 'py-2', 'm-3', 'text-black', 'bg-transparent', 'border', 'border-black', 'rounded-full', 'hover:bg-gradient-to-r', 'hover:from-orange-500','hover:to-red-500', 'hover:border-hidden')
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
    startOverBtn.classList.add('px-6', 'py-2', 'm-3', 'text-black', 'bg-transparent', 'border', 'border-black', 'rounded-full', 'hover:bg-gradient-to-r', 'hover:from-orange-500','hover:to-red-500', 'hover:border-hidden')

    let headerSelectedEvent = document.createElement('h3')
    headerSelectedEvent.textContent = 'Selected event:'
    headerSelectedEvent.classList.add('text-large')

    header.append(startOverBtn, headerSelectedEvent)

    startOverBtn.addEventListener('click', function() {
        window.location.reload()
    })

    restaurantSearch()
}

function restaurantSearch() {
    // let localBusinessAPI = 'https://local-business-data.p.rapidapi.com/search-in-area?query=restaurant&lat=' + selectedLat + '&lng=' + selectedLog + '&zoom=10&limit=10&language=en'

    // const options = {
    //     method: 'GET',
    //     headers: {
    //         'X-RapidAPI-Key': '1ec3590d92mshe2db421ebc47e2dp11e3fbjsn51804c2778b9',
    //         'X-RapidAPI-Host': 'local-business-data.p.rapidapi.com'
    //     }
    // };

    // fetch(localBusinessAPI, options)
    //     .then(function(response) {
    //         if (!response.ok) {
    //             throw response.json();
    //         }
    //         return response.json()
    //         console.log(response.status)
    //     })
    //     .then(function(data) {
    //         console.log('data', data)
    //     })
  
let tomTomKey = '3aWbf4bSQiqT1RSdBrvgmKqJNJnm5P8R'
let tomTomUrl = 'https://api.tomtom.com/search/2/categorySearch/restaurant.json?&lat=' + selectedLat + '&lon=' + selectedLog + '&key=' + tomTomKey

    
    fetch(tomTomUrl)
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


// EVENT Listeners
searchBtn.addEventListener('click', getTmEvents)

for (let i=0; i < closeModalBtn.length; i++) {
    closeModalBtn[i].addEventListener('click', function() {
        modalEl.classList.add('hidden')
    })
}