
//definisco il type



// http://localhost:3333/destinations?search=${query}

async function getDashboardData(query: string): Promise<unknown> {

  try {
    //dichiaro le 3 promise che devono essere effettuate in parallelo
    const promise1 = await fetch(`http://localhost:3333/destinations?search=${query}`)
    const promise1Json = promise1.json()

    const promise2 = await fetch(`http://localhost:3333/weathers?search=${query}`)
    const promise2Json = promise2.json()

    const promise3 = await fetch(`http://localhost:3333/airports?search=${query}`)
    const promise3Json = promise3.json()

    //GEstione errore response promise
    if (!promise1.ok || !promise2.ok || !promise3.ok) {
      throw new Error(`Errore Http: 
        ${!promise1.ok ? promise1.status : 
        !promise2.ok ? promise2.status : 
        !promise3.ok ? promise3.status : null}`);
    }




    const response = await Promise.all([promise1Json, promise2Json, promise3Json])


    return response

  } catch (err) {

    if (err instanceof Error) {
      throw new Error(`Errore nel caricare i dati ${err.message}`);
    }

    return null
  }

}

//RISOLVO PROMISES getDashboardData()
(async () => {
  const data = await getDashboardData("london")
  console.log(data);
})()








