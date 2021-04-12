const searchButton = $("#search-button");
const selectedCity = $("#city-search");
const savedCityList = $("#past-search");
const forcastContainer = $("#forecast");
const currentWeather = $("#current-weather");

let today = new moment().format("MMM Do");
console.log(today);


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
    forcastContainer.append("");
    const uvUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${x}&lon=${y}&units=imperial&exclude=hourly,minutely&cnt=6&appid=3807d383248b2e55ef5982aac69761eb`;
    fetch(uvUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
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


loadDefaultCity();


$("#clear-history").click( (e) => {
    e.preventDefault();
    localStorage.setItem("data", "[]");
    $("#past-search").html(" ");
    searchIndex = 0;
})



let searchIndex = 0;

searchButton.click( (e) => {
    e.preventDefault();
    let city = selectedCity.val();
    

    if (localStorage.getItem("data") == null) {
        localStorage.setItem("data", "[]");
    }

    let dataBox = JSON.parse(localStorage.getItem("data"));
    dataBox.push(city);

    localStorage.setItem("data", JSON.stringify(dataBox));

    
    appendSearch(searchIndex);
    searchIndex++;
    
    
    const baseUrl = "https://api.openweathermap.org/data/2.5/forecast?";
    const inputCity = `q=${city}`;
    const timeSpan = "&cnt=6";
    const apiId = "&units=imperial&appid=3807d383248b2e55ef5982aac69761eb";
    const requestUrl = baseUrl + inputCity + timeSpan + apiId;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
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
            
        });

})



function appendSearch(index) {
    console.log(localStorage)

    if (localStorage.getItem("data") != null) {
        let recentArray = JSON.parse(localStorage.getItem("data"));
        let newAppend = recentArray[index];
        savedCityList.append(`<p class="old-search">${newAppend}</p>`)
    }
}


if (localStorage.getItem("data") != null) {
    let recentArray = JSON.parse(localStorage.getItem("data"));
    recentArray.forEach( (search, index) => {
        let bootAppend = recentArray[index];
        savedCityList.append(`<p class="old-search">${bootAppend}</p>`);
        searchIndex = index + 1;

    })

}
