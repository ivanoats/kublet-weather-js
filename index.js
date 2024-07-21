import fetch from 'node-fetch';

const IP = '10.0.0.115';
const name = 'Wind Speed';

function metersPerSecondToMph(ms) {
  return ms * 2.23694
}

async function setKublet() {
  const weatherURL = "https://www.ndbc.noaa.gov/data/realtime2/WPOW1.txt";
  const wxResponse = await fetch(weatherURL);;
  const wxBody = await wxResponse.text();
  const wxArray = wxBody.split('\n');
  const wxData = wxArray[2].split(' ');
  console.log(wxData);
  const windSpeedMS = parseFloat(wxData[8]);
  console.log(wxData[8]);

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
setInterval(setKublet, interval);
