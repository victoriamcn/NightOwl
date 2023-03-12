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
let modalEl = document.querySelector('.modal-alert')
let closeModalBtn = document.querySelectorAll('.close-modal')
let modalText = document.querySelector('.alert-message')
let sports = ""
let arts = ""
let music = ""
let eventCards = document.querySelector('.events')
let venueLat = []
let venueLon = []
let selectedLat = ""
let selectedLog = ""
let eventCardsHeader = document.createElement('h3')
let restaurantsHeader = document.createElement('h3')
let restaurantCards = document.querySelector('.restaurants')
let citiesMenu = document.querySelector('.citiesMenu')
let hamburgerBtn = document.querySelector('#hamburger')

// Check cities in localStorage
let allCities = []
let citiesFromLocalStorage = JSON.parse(localStorage.getItem('allCities'))
console.log(citiesFromLocalStorage)
if (citiesFromLocalStorage) {
    allCities = citiesFromLocalStorage
    printLocalStorageCities()
}

// GET TicketMaster Events
function getTmEvents() {

    if (!city.value || !inputDate.value) {
        modalText.textContent = 'Please, enter city AND date'
        modalEl.showModal()
    } else {
        if (!isSports.checked && !isMusic.checked && !isArts.checked) {
            modalText.textContent = 'Please add at least one type of event'
            modalEl.showModal()
        } else {
            let cityState = city.value.split(', ')
            console.log(cityState)
            saveCityLocalStorage()
            getActivityType()
            let dayAfter = dayjs(inputDate.value).add(1, 'day').format('YYYY-MM-DD')
            console.log(dayAfter)
            let apiTM = 'https://app.ticketmaster.com/discovery/v2/events.json?' + sports + arts + music + '&city=' + city.value + '&radius=100&unit=miles' + '&startDateTime=' + inputDate.value + 'T10:00:00Z&endDateTime=' + dayAfter + 'T00:00:00Z&apikey=' + tmKey
            fetch(apiTM)
                .then(function (response) {
                    if (!response.ok) {
                        throw response.json();
                    }
                    return response.json()
                    console.log(response.status)
                })
                .then(function (data) {
                    eventCardsHeader.innerHTML = ""
                    console.log('data', data)
                    sports = ""
                    arts = ""
                    music = ""
                    eventCards.innerHTML = ""
                    venueLat = []
                    venueLon = []
                    if (data.page.totalElements === 0) {
                        modalText.textContent = 'No events were found, please try another option!'
                        modalEl.showModal()
                    } else {
                        eventCardsHeader.textContent = 'Events found in ' + city.value
                        ticketmasterOptions.append(eventCardsHeader)
                        eventCardsHeader.classList.add('text-center', 'neontext', 'headerEvents')
                        eventCardsHeader.scrollIntoView({behavior: "smooth"})

                        // Fill out Event Cards
                        for (let i = 0; i < data._embedded.events.length; i++) {
                            printEvents(data._embedded.events[i])
                            eventCards.children[i].setAttribute('data-index', i)
                        }
                    }
                })
        }
    }
}

// SAVE searched city in localStorage
function saveCityLocalStorage() {
    let isRepeated = false
    for (let i = 0; i < allCities.length; i++) {
        if ((city.value).toUpperCase() === allCities[i].toUpperCase()) {
            isRepeated = true
            return
        }
    }
    if (isRepeated === false) {
        allCities.unshift(city.value)
        if (allCities.length > 5) {
            allCities.pop()
        }
        localStorage.setItem('allCities', JSON.stringify(allCities))
        // printLocalStorageCities()
        console.log(citiesFromLocalStorage)
        console.log(allCities)
    }
}

// PRINT LocalStorageCities

function printLocalStorageCities() {
    console.log(citiesFromLocalStorage)
    citiesMenu.innerHTML = ""
    for (let i = 0; i < citiesFromLocalStorage.length; i++) {
        let cityLink = document.createElement('a')
        cityLink.textContent = citiesFromLocalStorage[i]
        cityLink.setAttribute('href', '#')
        cityLink.classList.add('dropdown-item')
        cityLink.addEventListener('click', autofillCity)
        citiesMenu.append(cityLink)
    }

    function autofillCity(event) {
        console.log('clicked city', event.target.textContent)
        city.value = event.target.textContent
    }
}

// ACTIVITY type requested by user
function getActivityType() {
    if (isSports.checked) {
        sports = '&classificationName=sports'
    }
    if (isArts.checked) {
        arts = '&classificationName=arts&theatre'
    }
    if (isMusic.checked) {
        music = '&classificationName=music'
    }
}

// PRINT TicketMaster Events
function printEvents(eventsFound) {
    console.log(eventsFound)
    let card = document.createElement('div')
    eventCards.classList.add('flex', 'flex-row', 'flex-wrap', 'col-12', 'justify-content-around', 'md:flex-column', 'md:justify-items-center', 'sm:flex-column', 'sm:justify-items-center')
    card.classList.add('flex', 'flex-column', 'm-4', 'col-5', 'items-center', 'p-3', 'cards', 'sm:col-12')

    //EVENT HEADER
    let eventName = document.createElement('h4')
    eventName.classList.add('p-3', 'text-lg', 'font-bold', 'text-center', 'border-bottom')
    let eventPicture = document.createElement('img')
    eventPicture.classList.add('rounded', 'mx-auto', 'my-1')
    let eventDetails = document.createElement('p');
    eventDetails.classList.add('mb-1', 'flex', 'flex-row', 'flex-wrap', 'details');
    let linkToTickets = document.createElement('a')

    eventName.textContent = eventsFound.name
    eventPicture.setAttribute('src', eventsFound.images[0].url)
    eventPicture.setAttribute('width', '300px')
    let eventLocalTime = dayjs(eventsFound.dates.start.localDate + ', ' + eventsFound.dates.start.localTime).format('MMM DD, YYYY [at] hh:mm a')
    console.log("eventLocalTime", eventLocalTime)
    eventDetails.innerHTML = '<span class="material-symbols-outlined">event</span> ' + eventLocalTime + ' | ' + '<span class="material-symbols-outlined">location_on</span> '
     + eventsFound._embedded.venues[0].name

    //TICKET LINK
    linkToTickets.textContent = "Click to purchase your tickets!"
    linkToTickets.setAttribute('href', eventsFound.url)
    linkToTickets.setAttribute('target', '_blank')
    linkToTickets.classList.add('mb-1', 'underline', 'hover:no-underline')

    venueLat.push(eventsFound._embedded.venues[0].location.latitude)
    venueLon.push(eventsFound._embedded.venues[0].location.longitude)

    //SELECT BUTTON
    let selectBtn = document.createElement('button')
    selectBtn.textContent = 'Select event!'
    selectBtn.classList.add('px-6', 'py-2', 'm-3', 'text-white', 'bg-transparent', 'border', 'border-black', 'rounded-full', 'button')
    selectBtn.addEventListener('click', giveLocation)

    //APPEND
    card.append(eventName, eventPicture, eventDetails, linkToTickets, selectBtn)

    eventCards.append(card)
}

function giveLocation(event) {
    let clickedBtn = event.target
    let selectedElementDiv = clickedBtn.parentElement
    console.log(selectedElementDiv)
    selectedElementDiv.classList.add('selectedEvent')
    let dataIndexSelectedEvent = selectedElementDiv.getAttribute('data-index')
    console.log(dataIndexSelectedEvent)
    // Selected event venue lat and long to input in restaurants API
    selectedLat = venueLat[dataIndexSelectedEvent]
    selectedLog = venueLon[dataIndexSelectedEvent]
    console.log(selectedLat, selectedLog)
    // DELETE unselected events
    for (let i = 0; i < eventCards.children.length; i++) {
        if (eventCards.children[i].getAttribute('data-index') !== dataIndexSelectedEvent) {
            // eventCards.children[i].innerHTML = ""
            eventCards.children[i].style.display = "none"
        }
    }

    // hide ticketmaster options
    ticketmasterOptions.classList.add('hidden')

    // Create START over button
    let selectedDiv = document.createElement('div')
    selectedDiv.classList.add('d-flex', 'align-items-center', 'justify-content-center')
    eventCards.prepend(selectedDiv)

    let startOverBtn = document.createElement('button')
    startOverBtn.innerText = 'Start Over'
    startOverBtn.classList.add('button', 'align-self-start', 'px-10px', 'py-3px', 'mt-10')

    let headerSelectedEvent = document.createElement('h3')
    headerSelectedEvent.textContent = 'Selected event:'
    headerSelectedEvent.classList.add('text-large')

    selectedDiv.append(startOverBtn, headerSelectedEvent)

    startOverBtn.addEventListener('click', function () {
        window.location.reload()
    })

    restaurantSearch()
}

function restaurantSearch() {

    let localBusinessAPI = 'https://local-business-data.p.rapidapi.com/search-in-area?query=restaurant&lat=' + selectedLat + '&lng=' + selectedLog + '&zoom=10&limit=10&language=en'

    const options = {
        method: 'GET',
        headers: {
            // 'X-RapidAPI-Key': '0e7e231b8cmsh8e33f7fca2b1548p1aeeecjsn037258c2c197',
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
            if (data.data.length === 0) {
                modalText.textContent = 'No restaurants found nearby your event location'
                modalEl.showModal()
            } else {
            restaurantsHeader.classList.add('my-15', 'py-15', 'text-lg', 'font-bold', 'text-center', 'neontext', 'headerEvents')
            restaurantsHeader.textContent = 'Restaurants in your event area'
            restaurantCards.append(restaurantsHeader)    
            restaurantCards.classList.add('flex', 'flex-row', 'flex-wrap', 'col-12', 'justify-content-around', 'md:flex-column', 'md:justify-items-center', 'sm:flex-column', 'sm:justify-items-center')
            
            printRestaurantCards(data.data)
            }
    })
}

// PRINT Restaurant cards
function printRestaurantCards(restaurant) {
    console.log(restaurant, restaurant.length)
    for(let i=0; i < restaurant.length; i++) {
        let restCard = document.createElement('div');
        restCard.classList.add('flex', 'flex-column', 'm-4', 'col-5', 'items-center', 'p-3', 'cards', 'sm:col-12');
        restCard.setAttribute('data-index', i)

        let name = document.createElement('h4');
        name.classList.add('p-3', 'text-lg', 'font-bold', 'text-center', 'border-bottom')
        name.textContent = restaurant[i].name;
        restCard.append(name);

        let image = document.createElement('img');
        image.classList.add('h-32', 'w-32', 'object-cover', 'rounded-full', 'mx-auto', 'mt-2');
        image.setAttribute('src', restaurant[i].photos_sample[0].photo_url);
        image.setAttribute('width', '300px')
        restCard.append(image);

        let rating = document.createElement('p');
        rating.classList.add('mb-1', 'flex', 'flex-row', 'flex-wrap', 'details');
        rating.innerHTML = '<span class="material-symbols-outlined">star_rate</span>' + `Rating: ${restaurant[i].rating}`;
        restCard.append(rating);

        let address = document.createElement('p');
        address.classList.add('mb-1', 'flex', 'flex-row', 'flex-wrap', 'details');
        address.innerHTML = '<span class="material-symbols-outlined">location_on</span> ' + restaurant[i].street_address;
        restCard.append(address);

        let phone = document.createElement('p');
        phone.classList.add('mb-1', 'flex', 'flex-row', 'flex-wrap', 'details');
        phone.innerHTML = '<span class="material-symbols-outlined">call</span> ' + restaurant[i].phone_number;
        restCard.append(phone);

        let restaurantLink = document.createElement('a')
        restaurantLink.setAttribute('href', restaurant[i].place_link)
        restaurantLink.setAttribute('target', '_blank')
        restaurantLink.classList.add('mb-1', 'underline', 'hover:no-underline')
        restaurantLink.textContent = 'Learn more about this place'
        restCard.append(restaurantLink)
        
        //SELECT BUTTON
        let selectRestBtn = document.createElement('button')
        selectRestBtn.textContent = 'Select this place!'
        selectRestBtn.classList.add('px-6', 'py-2', 'm-3', 'text-white', 'bg-transparent', 'border', 'border-black', 'rounded-full', 'button')
        selectRestBtn.addEventListener('click', printSelection)
        restCard.append(selectRestBtn)

        restaurantCards.append(restCard);
    }
};

// Print event AND restaurant selected by the user
function printSelection(event) {
    console.log(event.target)
    console.log('restaurant-selected', event.target.parentElement)
    let selectedRestaurantIndex = event.target.parentElement.getAttribute('data-index')
    console.log(selectedRestaurantIndex)
    for (let i=0; i < restaurantCards.children.length; i++) {
        if (restaurantCards.children[i].getAttribute('data-index') !== selectedRestaurantIndex) {
            restaurantCards.children[i].style.display= 'none'
        }
    }
}

// EVENT Listeners
searchBtn.addEventListener('click', getTmEvents)

for (let i = 0; i < closeModalBtn.length; i++) {
    closeModalBtn[i].addEventListener('click', function () {
        modalEl.close()
    })
}