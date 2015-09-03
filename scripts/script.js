$(function(){
    $('#btnGetWeather').click(function () {
        getWeatherByCity('ua', dataReceived, showError, $('#inputCityName').val());
    });
    
    getWeatherData('ua', dataReceived, showError);
    

    function dataReceived(data) {
        var offset = (new Date()).getTimezoneOffset()*60*1000; // Відхилення від UTC  в мілісекундах
        var city = data.city.name;
        var country = data.city.country;
        $("#weatherTable tr:not(:first)").remove();

        $.each(data.list, function(){
            // "this" тримає об'єкт прогнозу звідси: http://openweathermap.org/forecast16
            var localTime = new Date(this.dt*1000 - offset); // конвертуємо час з UTC у локальний
            addWeather(
                this.weather[0].icon,
                moment(localTime).calendar(),	// Використовуємо moment.js для представлення дати
                this.weather[0].description,
                Math.round(this.temp.day) + '&deg;C',
                Math.round(this.temp.night) + '&deg;C',
                this.humidity + '%',
                Math.round(this.speed) + 'm/s'
            );
        });
        $('#location').html(city + ', <b>' + country + '</b>'); // Додаємо локацію на сторінку
    }

    function addWeather(icon, day, condition, tempd, tempn, humidity, speed){
        var markup = '<tr>'+
                '<td>' + day + '</td>' +
                '<td>' + tempd + '</td>' +
                '<td>' + tempn + '</td>' +
                '<td>' + condition + '</td>' +
                '<td>' + '<img src="images/icons/'+ 
                  ( (icon === '10ddd')? '10d' : icon) // Fix in case if server returns unknown icon 10ddd 
                  +'.png" />' + '</td>' +
                '<td>' + speed + '</td>' +
                '<td>' + humidity + '</td>'
            + '</tr>';
        weatherTable.insertRow(-1).innerHTML = markup; // Додаємо рядок до таблиці
    }

    function showError(msg){
        $('#error').html('Сталася помилка: ' + msg);
    }
});