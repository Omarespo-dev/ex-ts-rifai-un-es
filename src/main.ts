
//definisco il type per la dasboard
type Dashboard = {
  city: string,
  country: string,
  temperature: number,
  weather: string,
  airport: string
}


// http://localhost:3333/destinations?search=${query}

async function getDashboardData(query: string): Promise<Dashboard | null> {

  try {
    //dichiaro le 3 promise che devono essere effettuate in parallelo
    const promise1 = fetch(`http://localhost:3333/destinations?search=${query}`)
    const promise2 = fetch(`http://localhost:3333/weathers?search=${query}`)
    const promise3 = fetch(`http://localhost:3333/airports?search=${query}`)

    //fetch in parallelo e ottengo la risposta che e un object con uno status etc..
    const [res1, res2, res3] = await Promise.all([promise1, promise2, promise3]);


    //GEstione errore response promise
    if (!res1.ok || !res2.ok || !res3.ok) {
      throw new Error(`Errore Http: 
        ${!res1.ok ? res1.status : !res2.ok ? res2.status : !res3.ok ? res3.status : null}`);
    }


    //converto in json e ottengo ogni singolo dato [{}]
    const [data1, data2, data3] = await Promise.all([res1.json(), res2.json(), res3.json()]);

    //prendo il primo elemento da arr
    const destination = data1[0];
    const weatherData = data2[0];
    const airportData = data3[0];

    
    //formato in un oggetto personalizzato
    const dataTutto: Dashboard = {
      city: destination ? destination.name : "Error city",
      country: destination ? destination.country : "Error country",
      temperature: weatherData ? weatherData.temperature : "Error temperature",
      weather: weatherData ? weatherData.weather_description : "Error weather description",
      airport: airportData ? airportData.name : "Error Name"
    }

    //lo stampo
    console.log(dataTutto);


    console.log(
      `${dataTutto.city} is in ${dataTutto.country}.\n` +
      `Today there are ${dataTutto.temperature} degrees and the weather is ${dataTutto.weather}.\n` +
      `The main airport is ${dataTutto.airport}.\n`
    );


    return dataTutto

  } catch (err) {

    if (err instanceof Error) {
      throw new Error(`Errore nel caricare i dati ${err.message}`);
    }

    return null
  }

}

// //RISOLVO PROMISES getDashboardData()
(async () => {
  const data = await getDashboardData("zurich")
  console.log(data);

})()









