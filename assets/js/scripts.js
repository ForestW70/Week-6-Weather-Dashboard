const searchButton = $("#search-button");
const selectedCity = $("#city-search");
const savedCityList = $("#past-search");
const forcastContainer = $("#forecast");
const currentWeather = $("#current-weather");


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
            $("#todayWind").text(`The wind is blowing at ${curWindSpeed} in the ${curWindDeg}° direction.`);
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
            $("#todayUv").text(`UV index: ${uvIndex}`);

            for (i=1; i < 6; i++) {
                let parent = document.createElement("div");
                parent.setAttribute("id", `day${i}`);
                parent.setAttribute("class", "col-2 card");
                forcastContainer.append(parent);
        

                let icon = "https://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png";

                $(`#day${i}`).append(`<img src="${icon}">`);

                $(`#day${i}`).append(`<strong>day${i}</strong>`);
                $(`#day${i}`).append(`<p>Daily high: ${Math.round(data.daily[i].temp.max)}°F</p>`);
                $(`#day${i}`).append(`<p>Daily low: ${Math.round(data.daily[i].temp.min)}°F</p>`);
                $(`#day${i}`).append(`<p>humidity: ${data.daily[i].humidity}%</p>`);
                

        
                
            }
        });    
}

// function pushFiveDayForecast(data) {
//     for (i=1; i <= data.list.length; i++) {
//         let parent = document.createElement("div");
//         parent.setAttribute("id", i);
//         parent.setAttribute("class", "col-2 card");
//         forcastContainer.append(parent);

//         let cardDateRaw = data.list[i].clouds.dt_text.split(" ");
//         let cardDateElements = cardDateRaw[0].split("-");
//         let cardDate = `${cardDateElements[1]} / ${cardDateElements[2]}`;
        
//         document.getElementById(`"${i}"`).append(`<strong>${cardDate}</strong>`);
//         document.getElementById(`"${i}"`).append(`<p>${data.list[i].main.temp}</p>`);
//         document.getElementById(`"${i}"`).append(`<p>${data.list[i].main.humidity}</p>`);

        
//     }
// }

loadDefaultCity();








searchButton.click( (e) => {
    e.preventDefault();
    let city = selectedCity.val();
    
    
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
            $("#todayWind").text(`The wind is blowing at ${curWindSpeed} in the ${curWindDeg}° direction.`);
            $("#todayBlurb").text(`Looks like ${curStatus} ahead!`);
            
        });

})