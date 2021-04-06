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
            getUvIndex(cityLat, cityLong);
            
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

function getUvIndex(x, y) {
    const uvUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${x}&lon=${y}&units=imperial&cnt=1&appid=3807d383248b2e55ef5982aac69761eb`;
    fetch(uvUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            let uvIndex = data.current.uvi;
            $("#todayUv").text(`UV index: ${uvIndex}`);
        });    
}

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
            getUvIndex(cityLat, cityLong);
            
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