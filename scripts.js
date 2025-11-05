const API_KEY = "4dd7527c27f549f3af9193251250511"; 
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");
const forecastCard = document.getElementById("forecastCard");
const forecastContainer = document.getElementById("forecastContainer");
const errorCard = document.getElementById("errorCard");
const loadingCard = document.getElementById("loadingCard");

const weatherIcons = {
    clear: "☀",
    clouds: "☁",
    rain: "🌧",
    drizzle: "🌦",
    thunderstorm: "⛈",
    snow: "❄",
    mist: "🌫"
};

function setGreeting() {
    const hour = new Date().getHours();
    const greetingText = document.getElementById("greetingText");
    const greetingSubtext = document.getElementById("greetingSubtext");

    if (hour < 12) {
        greetingText.textContent = "Good Morning! ☀";
        greetingSubtext.textContent = "Let's start the day with the weather";
    } else if (hour < 17) {
        greetingText.textContent = "Good Afternoon! 🌤";
        greetingSubtext.textContent = "How's the weather looking?";
    } else {
        greetingText.textContent = "Good Evening! 🌙";
        greetingSubtext.textContent = "Let's check tonight's weather";
    }
}

searchBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") getWeather();
});

async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) return showError("Please type a city name.");

    hideAll();
    loadingCard.classList.add("show");

    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no&alerts=no`
        );

        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        displayWeather(data);
        displayForecast(data.forecast.forecastday);
    } catch (err) {
        showError("City not found — check spelling!");
    } finally {
        loadingCard.classList.remove("show");
    }
}

function displayWeather(data) {
    document.getElementById("cityName").textContent = `${data.location.name}, ${data.location.country}`;
    document.getElementById("localTime").textContent = data.location.localtime;
    document.getElementById("temperature").textContent = `${Math.round(data.current.temp_c)}°`;
    document.getElementById("feelsLike").textContent = `${Math.round(data.current.feelslike_c)}°`;
    document.getElementById("condition").textContent = data.current.condition.text;
    document.getElementById("humidity").textContent = `${data.current.humidity}%`;
    document.getElementById("windSpeed").textContent = `${Math.round(data.current.wind_kph)} km/h`;
    document.getElementById("pressure").textContent = `${data.current.pressure_mb} mb`;
    document.getElementById("visibility").textContent = `${data.current.vis_km} km`;

    const iconKey = data.current.condition.text.toLowerCase();
    document.getElementById("weatherIcon").textContent =
        weatherIcons[iconKey] || "🌤";

    weatherCard.classList.add("show");
}

function displayForecast(days) {
    forecastContainer.innerHTML = "";

    days.forEach(day => {
        const iconKey = day.day.condition.text.toLowerCase();
        const icon = weatherIcons[iconKey] || "🌤";

        forecastContainer.innerHTML += `
            <div class="forecast-day">
                <div>${new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}</div>
                <div style="font-size:35px">${icon}</div>
                <div class="forecast-temp">${Math.round(day.day.avgtemp_c)}°C</div>
            </div>
        `;
    });

    forecastCard.style.display = "block";
}

function showError(msg) {
    document.getElementById("errorMessage").textContent = msg;
    errorCard.classList.add("show");
    setTimeout(() => errorCard.classList.remove("show"), 4000);
}

function hideAll() {
    weatherCard.classList.remove("show");
    forecastCard.style.display = "none";
}

setGreeting();
cityInput.value = "London";
getWeather();
