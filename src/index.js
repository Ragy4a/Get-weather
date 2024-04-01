'use strict';

document.addEventListener('DOMContentLoaded', function () {
    const cityNameInput = document.getElementById('city-name');
    const cityIdInput = document.getElementById('city-id');
    const nameRadio = document.getElementById('name');
    const idRadio = document.getElementById('id');
    const weatherButton = document.querySelector('.button-container > button:nth-child(2)');
    const cancelButton = document.querySelector('.button-container > button[type=reset]');
    const temperature = document.getElementById('temperature');
    const windSpeed = document.getElementById('wind-speed');
    const humidity = document.getElementById('humidity');
    const errorContainer = document.createElement('div')
    let errorDisplayed = false;
    
    function updateInputFields() {
        cityNameInput.disabled = !nameRadio.checked;
        cityIdInput.disabled = !idRadio.checked;
        if (nameRadio.checked) {
                cityIdInput.value = ''; 
        } else {
                cityNameInput.value = '';
        }
    }
    
    nameRadio.addEventListener('change', updateInputFields);
    idRadio.addEventListener('change', updateInputFields);
    
    function getWeather (event) {
        event.preventDefault();
        errorDisplayed = false;
        const celsiusSign = '\u2103';
        const param = {
            url: 'https://api.openweathermap.org/data/2.5/',
            appid: 'f1668c5cf2440d8ed4374edbeb6a0445',
            cityName: cityNameInput.value,
            cityId: cityIdInput.value,
        };
        fetch(
            `${param.url}weather?q=${param.cityName}&id=${param.cityId}&units=metric&APPID=${param.appid}`
        )
        .then((response) => {
            if (response.status === 404) throw new Error('City name or city id is wrong.')
            if (!response.ok) throw new Error('Failed to accept response message!');
            return response.json();
        })
        .then((info) => {
            errorDisplayed = false;
            if (errorContainer) {
                errorContainer.remove();
            }
            temperature.textContent = `${info.main.temp} ${celsiusSign}`
            windSpeed.textContent = `${info.wind.speed} m/s`
            humidity.textContent = info.main.humidity
        })
        .catch((error) => {
            if (!errorDisplayed) {
                showError(error.message);
                errorDisplayed = true;
            }
        })
    };
    
    weatherButton.addEventListener('click', getWeather)

    function showError(errorMessage) {
        errorContainer.classList.add('error-container')
        const inputsContainer = document.querySelector('.inputs-container');
        errorContainer.textContent = errorMessage;
        inputsContainer.append(errorContainer);
    }

    cancelButton.addEventListener('click', () => {
        temperature.textContent = '';
        windSpeed.textContent = '';
        humidity.textContent = '';
    });
    
});