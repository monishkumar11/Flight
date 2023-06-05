const axios = require("axios");
const { XMLParser, parse } = require("fast-xml-parser");


async function getAirportCodeFromCityName(city) {
  let cityname = city.trim();
  cityname = cityname.toLowerCase();

  var request_params = {
    method: "GET",
    url: "https://airports-by-api-ninjas.p.rapidapi.com/v1/airports",
    params: { city: cityname },
    headers: {
      "X-RapidAPI-Key": "5d5c173cc7msh076dad1898fe3d6p120bcdjsn47e89189453a",
      "X-RapidAPI-Host": "airports-by-api-ninjas.p.rapidapi.com",
    },
  };
  try {
    const response = await axios.request(request_params);
    // console.log();
    // console.log(response.data.length)
    for (var i = 0; i < response.data.length; i++) {
      if (response.data[i].iata == "") {
        continue;
      }
      console.log("airport code for ",city ,"is ",response.data[i].iata);
      return response.data[i].iata;
    }
    return "";
  } catch (error) {
    console.log("inside code  details");
    console.error(error);
  }
}

async function getFlightDetails(source, destination, date) {

  const request_params = {
    method: "GET",
    url: "https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchFlights",
    params: {
      sourceAirportCode: source,
      destinationAirportCode: destination,
      date: date,
      itineraryType: "ONE_WAY",
      sortOrder: "PRICE",
      numAdults: "1",
      numSeniors: "0",
      classOfService: "ECONOMY",
      currencyCode: "USD",
    },
    headers: {
      "X-RapidAPI-Key": "5d5c173cc7msh076dad1898fe3d6p120bcdjsn47e89189453a",
      "X-RapidAPI-Host": "tripadvisor16.p.rapidapi.com",
    },
  };
  try {
    const response = await axios.request(request_params);
    // console.log(response.data.data);
    // console.log(response.flights);
    return response.data.data.flights;
    res
  } catch (error) {
    console.error(error);
  }
}


async function main() {
  const sourceCity = "new delhi";
  const destCity = "tokyo";

  const sourceCityCode = await getAirportCodeFromCityName(sourceCity);
  if (sourceCityCode == "") {
    console.log("invalid source city name");
    return;
  }

  const destCityCode = await getAirportCodeFromCityName(destCity);
  if (destCityCode == "") {
    console.log("invalid destination city name");
    return;
  }

  let response = await getFlightDetails(
    sourceCityCode,
    destCityCode,
    "2023-06-04"
  );

  if (response.length == 0) {
    console.log("no data available!!");
    return;
  }

  console.log("flights from ",sourceCity," to ",destCity);
  console.log("INFORMATION IS SORTED BY PRICE");
  for( var i =0 ; i< response.length;i++){
    console.log("information of flight ",i+1);
    flightDetails = response[i];
    flightName = flightDetails.segments[0].legs[0].marketingCarrier.displayName;
    flightNumber = flightDetails.segments[0].legs[0].flightNumber;
    priceType = flightDetails.purchaseLinks[0].currency;
    price = flightDetails.purchaseLinks[0].totalPrice;

    console.log("AIRLINES :: ",flightName,"-(flight number) ",flightNumber,"- Price ::",price,priceType);
 
  }
}
main();