
const savedCityList = $("#past-search");
let searchIndex = 0;


loadDefaultCity();


// if there havent been any searches and this item in local storage doesnt exist, run default launch page for DC,
// past seach button template then foreach to append all stored searches on page refresh
if (localStorage.getItem("searchedCities") != null) {
    loadDefaultCity();

    let recentArray = JSON.parse(localStorage.getItem("searchedCities"));
    recentArray.forEach( (search, index) => {

        const searchP = document.createElement("p");
        searchP.innerText = search;
        searchP.classList.add("col-11", "old-search");
        searchP.setAttribute("onClick", `searchByCity("${search}")`)
        savedCityList.append(searchP);
        

        searchIndex = index + 1;

    })

}


function loadDefaultCity() {

    const defaultUrl = "https://api.openweathermap.org/data/2.5/forecast?q=washington%20dc&cnt=6&units=imperial&appid=3807d383248b2e55ef5982aac69761eb";
    fetch(defaultUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            
            let selCity = data.city.name;
            let selCountry = data.city.country;

            let curTemp = Math.round(data.list[0].main.temp);
            let feelsLike = Math.round(data.list[0].main.feels_like);
            let minTemp = Math.round(data.list[0].main.temp_min);
            let maxTemp = Math.round(data.list[0].main.temp_max);

            let curHumidity = Math.round(data.list[0].main.humidity);
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

            let curStatus = data.list[0].weather[0].description;

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


function getDaily(x, y) {
    $("#forecast").append("");
    
    const uvUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${x}&lon=${y}&units=imperial&exclude=hourly,minutely&cnt=6&appid=3807d383248b2e55ef5982aac69761eb`;
    fetch(uvUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            
            isReal = true;

            let timeStamp = data.current.dt;
            let timeZone = data.timezone_offset;
            let curTime = (timeStamp * 1000) + (timeZone * 1000);
            console.log(curTime);

            let unixDate = new Date(curTime);
            let isPm = false;
            
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
            
            let minutes = unixDate.getMinutes();
            if(minutes < 10) {
                minutes = "0" + minutes;
            }

            let realTime = hours + ":" + minutes;

            let realDateParts = unixDate.toDateString().split(" ");
            let realDate = realDateParts[0] + ", " + realDateParts[1] + " " + realDateParts[2] + ",";

            if (isPm) {
                $("#cityTime").text(realTime + " PM");
            } else {
                $("#cityTime").text(realTime + " AM");
            }

            $("#cityDate").text(realDate);

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


function searchByCity(city, isNewSearch = true) {
    const baseUrl = "https://api.openweathermap.org/data/2.5/forecast?";
    const inputCity = `q=${city}`;
    const timeSpan = "&cnt=6";
    const apiId = "&units=imperial&appid=3807d383248b2e55ef5982aac69761eb";
    const requestUrl = baseUrl + inputCity + timeSpan + apiId;
    const sanitizedCity = city.toLowerCase();


    let dataBox = JSON.parse(localStorage.getItem("searchedCities"));

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.cod === "200") {
                console.log(data)

                if (dataBox.indexOf(sanitizedCity) == -1 && isNewSearch) {
                    dataBox.push(sanitizedCity);
                    console.log(dataBox);
                    localStorage.setItem("searchedCities", JSON.stringify(dataBox));
                    appendSearch(searchIndex);
                    searchIndex++;
                    
                }
            
            
                isReal = true;
                console.log(requestUrl);
                let selCity = data.city.name;
                let selCountry = data.city.country;

                let curTemp = Math.round(data.list[0].main.temp);
                let feelsLike = Math.round(data.list[0].main.feels_like);
                let minTemp = Math.round(data.list[0].main.temp_min);
                let maxTemp = Math.round(data.list[0].main.temp_max);

                let curHumidity = Math.round(data.list[0].main.humidity);
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

                let curStatus = data.list[0].weather[0].description;

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
                return true;
            } else {
                alert("Please check your spelling!");

            }
        })
        
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

        savedCityList.append(searchP);

    }
}



$("#search-button").click( (e) => {
    e.preventDefault();
    let city = $("#city-search").val();

    
    
    if (localStorage.getItem("searchedCities") == null) {
        localStorage.setItem("searchedCities", "[]");
    }
    
    searchByCity(city);
})


$("#clear-history").click( (e) => {
    e.preventDefault();
    localStorage.setItem("searchedCities", "[]");
    $("#past-search").html(" ");
    searchIndex = 0;
})






