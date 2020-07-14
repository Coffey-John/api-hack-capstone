

function getCountriesData() {
  fetch("https://restcountries.eu/rest/v2/all")
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then((countriesArray) => displayDropdownOptions(countriesArray))
  .catch(err => {
    $('#js-error-message').text(`Something went wrong: ${err.message}`);
  });
}

function displayDropdownOptions(countriesArray) {
  let optionHTMLforEachCountry = "";
  countriesArray.forEach((country) => {
    optionHTMLforEachCountry += `
    <option value=${country.alpha3Code}>${country.name}</option>
    `;
  });
  $("#country").append(optionHTMLforEachCountry);
  watchForm(countriesArray);
}

function watchForm(json) {
  $("form").submit((event) => {
    event.preventDefault();
    let userSelectedCountry = $("#country option:selected").text();
    extractSelectedCountryInfo(userSelectedCountry, json);
  });
}


function createBorderButtons(
  borderArrayAlphaCodes,
  chosenCountry,
  countriesArray
) {
  let borderHTMLforEachCountry = `<p class='extraInfo'> Click button for border country info!</p> <br>`;
  borderArrayAlphaCodes.forEach((threeDigitCode) => {
    borderHTMLforEachCountry += `
      <button class="borderButtons"
      type="button" title='tooltiptext shows up' value=${threeDigitCode}
      >${threeDigitCode}</button>
    `;
  });
  return borderHTMLforEachCountry;
}

function createCountryNameArray(countriesArray) {
  let countryNameArray = [];
  countriesArray.forEach(function (country) {
    let countryName = country.name;
    countryNameArray.push(countryName);
  });
  createCountryAlpha3CodeArray(countriesArray, countryNameArray);
}
function createCountryAlpha3CodeArray(countriesArray, countryNameArray) {
  let countryAlpha3CodeArray = [];
  countriesArray.forEach(function (country) {
    let countryAlpha3Code = country.alpha3Code;
    countryAlpha3CodeArray.push(countryAlpha3Code);
  });
  createKeyValueArrayObject(
    countryAlpha3CodeArray,
    countryNameArray,
    countriesArray
  );
}


function createKeyValueArrayObject(
  countryAlpha3CodeArray,
  countryNameArray,
  countriesArray
) {
  let data = countryAlpha3CodeArray.reduce(function (acc, val, index) {
    acc[val] = countryNameArray[index];
    return acc;
  }, {});
  let keyValueArrayObject = [];
  keyValueArrayObject.push(data);
  watchClicks(keyValueArrayObject, countriesArray);
}

function watchClicks(keyValueArrayObject, countriesArray) {
  let keyValueObject = keyValueArrayObject[0];

  $(".borderCountries").on("click", ".borderButtons", function (event) {
    event.preventDefault();
    let userSelectedCode = $(this).val();
    let buttonValue = $("button").val();

    let chosenCountry = keyValueObject[userSelectedCode];

    $("#country").val(userSelectedCode);

    extractSelectedCountryInfo(chosenCountry, countriesArray);
  });
}

function getCountryHTMLandRenderToPage(chosenCountry, countriesArray) {
  let borderArrayAlphaCodes = chosenCountry.borders;

  $(".populateResults").html("");
  let countryHTML =

    `
      <div class='flagHolder'>
        <img src=${chosenCountry.flag}>
      </div>
      <div class='infoHolder'>
        <p class='info'>Country: ${
          chosenCountry.name.length > 1
            ? chosenCountry.name
            : "This data is unavailable or does not exist"
        }</p>
        <p class='info'>Capital: ${
          chosenCountry.capital.length > 1
            ? chosenCountry.capital
            : "This data is unavailable or does not exist"
        }</p>
        <p class='info'>Population: ${chosenCountry.population.toLocaleString()}</p>
        <p class='info'>Region: ${
          chosenCountry.region.length > 1
            ? chosenCountry.region
            : "This data is unavailable or does not exist"
        }</p>
        <div class='info borderCountries'>
        <p class='info'>
        Borders:
        <br>
        ${
          chosenCountry.borders.length > 0
            ? createBorderButtons(borderArrayAlphaCodes, chosenCountry)
            : "This data is unavailable or does not exist"
        }</p>


        </div>
      </div>
      `;
  $(".populateResults").append(countryHTML);

  createCountryNameArray(countriesArray);
}


function extractSelectedCountryInfo(userSelectedCountry, countriesArray) {
  let chosenCountry = countriesArray.find((country) => {
    return country.name === userSelectedCountry;
  });
  getCountryHTMLandRenderToPage(chosenCountry, countriesArray);
}

getCountriesData();