import fetch from 'node-fetch';

const IP = '10.0.0.115';
const name = 'Wind Speed';
const station = 'WPOW1';

function metersPerSecondToMph(ms) {
  return ms * 2.23694
}

async function setKublet() {
  const weatherURL = `https://www.ndbc.noaa.gov/data/realtime2/${station}.txt`;
  const wxResponse = await fetch(weatherURL);;
  const wxBody = await wxResponse.text();
  const wxArray = wxBody.split('\n');
  const wxRow = wxArray[2]
  const wxRowClean = wxRow.replace(/\s+/g, ' '); // remove extra whitespace
  const wxData = wxRowClean.split(' ');
  const windSpeedMS = parseFloat(wxData[6]);
  const windSpeed = Math.round(metersPerSecondToMph(windSpeedMS));

  var kubletUrl = `http://${IP}/update/?value=${windSpeed}&name=${name}`;

  const response = await fetch(kubletUrl);
  const body = await response.text();

  if (body === "OK") {
    console.log(`Successfully updated Kublet with ${windSpeed}`);
  } else {
    console.log(`Error updating Kublet at ${IP}: ${body}`);
  }
}

const numberOfSeconds = 120;
const interval = numberOfSeconds * 1000;
setKublet();
setInterval(setKublet, interval);