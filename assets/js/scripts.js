////////////////////
// search index is my global variable to track the position of cities in local storage
// along with making it easier to interact with the obj with for each and othe things.
let searchIndex = 0;


// if there havent been any searches and this item in local storage doesnt exist, run default launch page for DC,
// button template then foreach to append all stored searches on page refresh 
if (localStorage.getItem("searchedCities") != null) {
    loadDefaultCity();
    let recentArray = JSON.parse(localStorage.getItem("searchedCities"));


    // for each value in the array (LS), run this function where search is the value(city name),
    // and the index tracks where in the object we are and keeps seachindex in position (+1index cuz new button)
    recentArray.forEach( (search, index) => {
        const searchP = document.createElement("p");
        searchP.classList.add("col-11", "old-search");
        searchP.setAttribute("onClick", `searchByCity("${search}")`)
        searchP.innerText = search;
        $("#past-search").append(searchP);
        
        searchIndex = index + 1;

    })

}

// default page function for washington dc to display on boot. most of this is the same as my regular search function, but was before i fully understood how searching the api worked, so i would proabably be able to cut a lot of this out.
// call api with url hard-coded to DC
function loadDefaultCity() {

    const defaultUrl = "https://api.openweathermap.org/data/2.5/forecast?q=washington%20dc&cnt=6&units=imperial&appid=3807d383248b2e55ef5982aac69761eb";
    fetch(defaultUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let selCity = data.city.name;
            let selCountry = data.city.country;
            let curTemp = Math.round(data.list[0].main.temp);
            let feelsLike = Math.round(data.list[0].main.feels_like);
            let minTemp = Math.round(data.list[0].main.temp_min);
            let maxTemp = Math.round(data.list[0].main.temp_max);
            let curHumidity = Math.round(data.list[0].main.humidity);
            let curStatus = data.list[0].weather[0].description;
            let curWindSpeed = Math.round(data.list[0].wind.speed);
            let curWindDeg = data.list[0].wind.deg;
            let curWindDir;
            if (curWindDeg >= 315 && curWindDeg <= 45) {
                curWindDir = "Northernly";
            } else if (curWindDeg >= 46 && curWindDeg <= 135) {
                curWindDir = "Easternly";
            } else if (curWindDeg >= 136 && curWindDeg <= 225) {
                curWindDir = "Southernly";
            } else {
                curWindDir = "Westernly";
            }

            let cityLat = data.city.coord.lat;
            let cityLong = data.city.coord.lon;
            getDaily(cityLat, cityLong);
            $("#todayCity").text(`${selCity}, ${selCountry}`);
            $("#todayTemp").text(`It is currently ${curTemp}°F`);
            $("#feelsLike").text(`It feels like ${feelsLike}°F`);
            $("#dailyHigh").text(`Today's high is ${maxTemp}°F`);
            $("#dailyLow").text(`Today's Low is ${minTemp}°F`);
            $("#todayHumid").text(`Humidity is currently at ${curHumidity}%`);
            $("#todayWind").text(`The wind is blowing at ${curWindSpeed} MPH`);
            $("#todayWindDir").text(`in the ${curWindDir} direction.`);
            $("#todayBlurb").text(`Looks like ${curStatus} ahead!`);
        });
}



// initial search function of two for the searched city. allowed me to handle the city name as an input.

// construct api fetch url using city as an input. after making sure seach returns ok and is a new search, append seach history button for its city.
// isnewsearch is used to handle if the search is coming from the search bar or from pressing past seach button.
// isnewsearch set to tru as default. when past button searches, it will pass "false", instead of true
function searchByCity(city, isNewSearch = true) {
    const baseUrl = "https://api.openweathermap.org/data/2.5/forecast?";
    const inputCity = `q=${city}`;
    const timeSpan = "&cnt=6";
    const apiId = "&units=imperial&appid=3807d383248b2e55ef5982aac69761eb";
    const requestUrl = baseUrl + inputCity + timeSpan + apiId;

    // to prevent appending the same city with different capitalization
    const sanitizedCity = city.toLowerCase();
    
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.cod === "200") {
                
                // -- first time searches only --//
                // create array for the local storage. check to see if city doesnt already exist. -1 returns if index does not exist.
                // also check if isnewsearch input was passed as true from earlier
                // push in sanitized value to array and save.
                // create button and increiment global index
                let dataBox = JSON.parse(localStorage.getItem("searchedCities"));
                if (dataBox.indexOf(sanitizedCity) == -1 && isNewSearch) {
                    dataBox.push(sanitizedCity);
                    localStorage.setItem("searchedCities", JSON.stringify(dataBox));
                    appendSearch(searchIndex);
                    searchIndex++;
                    
                }
            
                // map all data points for current day's weather and appends.
                let selCity = data.city.name;
                let selCountry = data.city.country;
                let curTemp = Math.round(data.list[0].main.temp);
                let feelsLike = Math.round(data.list[0].main.feels_like);
                let minTemp = Math.round(data.list[0].main.temp_min);
                let maxTemp = Math.round(data.list[0].main.temp_max);
                let curHumidity = Math.round(data.list[0].main.humidity);
                let curStatus = data.list[0].weather[0].description;
                let curWindSpeed = Math.round(data.list[0].wind.speed);
                let curWindDeg = data.list[0].wind.deg;
                let curWindDir;

                // wind direction display logic
                if (curWindDeg >= 315 && curWindDeg <= 45) {
                    curWindDir = "Northernly";
                } else if (curWindDeg >= 46 && curWindDeg <= 135) {
                    curWindDir = "Easternly";
                } else if (curWindDeg >= 136 && curWindDeg <= 225) {
                    curWindDir = "Southernly";
                } else {
                    curWindDir = "Westernly";
                }

                // x and y coordinates for forecast api fetch
                let cityLat = data.city.coord.lat;
                let cityLong = data.city.coord.lon;
                getDaily(cityLat, cityLong);
                
                $("#todayCity").text(`${selCity}, ${selCountry}`);
                $("#todayTemp").text(`It is currently ${curTemp}°F`);
                $("#feelsLike").text(`It feels like ${feelsLike}°F`);
                $("#dailyHigh").text(`Today's high is ${maxTemp}°F`);
                $("#dailyLow").text(`Today's Low is ${minTemp}°F`);
                $("#todayHumid").text(`Humidity is currently at ${curHumidity}%`);
                $("#todayWind").text(`The wind is blowing at ${curWindSpeed} MPH`);
                $("#todayWindDir").text(`in the ${curWindDir} direction.`);
                $("#todayBlurb").text(`Looks like ${curStatus} ahead!`);
    
            // alert if fetch is unsuccessful
            } else {
                alert("Please check your spelling!");
            }
        })
        
}

// one of two api fetch calls that I use to get all of the data that I need to meet criteria. I think technically this api can get everything that I need, but to call it I need x and y coords and not city name, so I must first call the other search function to get those values for this function.
// create api call using the x and y of searched city after clearing the element that holds the 5 day forecast.
// find and format time for searched city. set and color code uv index. use for loop to append new 5 day forecast.
function getDaily(x, y) {
    $("#forecast").append("");
    
    const uvUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${x}&lon=${y}&units=imperial&exclude=hourly,minutely&cnt=6&appid=3807d383248b2e55ef5982aac69761eb`;
    fetch(uvUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // take unix and timezone to set a local unix time and creat a new date object from it
            // a bunch of dum logic to accurately display local time that i realized i didnt even need to write after 2h of debugging ¯\_(ツ)_/¯ 
            let timeStamp = data.current.dt;
            let timeZone = data.timezone_offset;
            let curTime = (timeStamp * 1000) + (timeZone * 1000);
            let unixDate = new Date(curTime);
            let isPm = false;
            
            // hours
            let hours = unixDate.getHours() + 4;
            if (hours > 0 && hours < 12) {
                hours = hours;
                isPm = false;
            } else if (hours > 12 && hours < 24) {
                hours = hours - 12;
                isPm = true;
            } else if (hours == 24) {
                hours = 12;
                isPm = false;
            } else if (hours > 24) {
                hours = hours - 24;
                isPm = false;
            } else {
                hours = 12;
                isPm = true;
            }
            
            // minutes
            let minutes = unixDate.getMinutes();
            if(minutes < 10) {
                minutes = "0" + minutes;
            }
            
            let realTime = hours + ":" + minutes;
            if (isPm) {
                $("#cityTime").text(realTime + " PM");
            } else {
                $("#cityTime").text(realTime + " AM");
            }
            let realDateParts = unixDate.toDateString().split(" ");
            let realDate = realDateParts[0] + ", " + realDateParts[1] + " " + realDateParts[2] + ",";
            $("#cityDate").text(realDate);

            // UV
            let uvIndex = data.current.uvi;
            const todayUv = $("#todayUv");
            todayUv.text(`UV index: ${uvIndex}`);
            if (uvIndex >= 0 && uvIndex <= 2) {
                todayUv.css("color", "green");
            } else if (uvIndex > 2 && uvIndex <= 5) {
                todayUv.css("color", "#e8e810");
            } else if (uvIndex > 5 && uvIndex <= 7) {
                todayUv.css("color", "orange");
            }else {
                todayUv.css("color", "red");
            }

            // 5day forecast
            // fun 5 times. create new date object. set appended date to current date + 1day,
            // date formatting. append icon (eww this icons suck)
            // append daily values to respective day's div
            for (i=1; i < 6; i++) {
                
                let forecastDay = new Date();
                forecastDay.setDate(forecastDay.getDate() + i);
                let newD = forecastDay.toDateString();
                let dayComponents = newD.split(" ");
                let postDate = `${dayComponents[0]}, ${dayComponents[1]} ${dayComponents[2]}`;
                let icon = "https://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png";
                
                $(`#day${i} img`).attr("src", icon);
                $(`#day${i} strong`).text(postDate);
                $(`#day${i} h3`).text(`Daily high: ${Math.round(data.daily[i].temp.max)}°F`);
                $(`#day${i} p`).text(`Daily low: ${Math.round(data.daily[i].temp.min)}°F`);
                $(`#day${i} span`).text(`humidity: ${data.daily[i].humidity}%`);
  
            }
        });    
}


// appending a button for the searched object (city), where index is an argument to map the local storage.
// called after my searchByCity() fetch was sucessful and the new searched city doesnt exist already.
// create a button template and use index # to push new [val] into a button
function appendSearch(cityIndex) {

    if (localStorage.getItem("searchedCities") != null) {
        const searchP = document.createElement("p");
        searchP.classList.add("col-11", "old-search");

        let recentArray = JSON.parse(localStorage.getItem("searchedCities"));
        let newAppend = recentArray[cityIndex];
        searchP.innerText = newAppend;

        searchP.addEventListener("click", () => {
            searchByCity(newAppend, false)
        })

        $("#past-search").append(searchP);

    }
}


// when the search city button is pressed, take value of city entered, 
// after creating empty [] in LS if didnt already exist, use search function with city as input
$("#search-button").click( (e) => {
    e.preventDefault();
    let city = $("#city-search").val();
    if (localStorage.getItem("searchedCities") == null) {
        localStorage.setItem("searchedCities", "[]");
    }
    searchByCity(city);
})


// when clear history button is pressed, set LS object back to an empty array
// clear all buttons and set seachindex back to 0.
$("#clear-history").click( (e) => {
    e.preventDefault();
    localStorage.setItem("searchedCities", "[]");
    $("#past-search").html(" ");
    searchIndex = 0;
})






