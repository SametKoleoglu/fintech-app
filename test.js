const axios = require("axios");

const options = {
  method: "GET",
  url: "https://coinranking1.p.rapidapi.com/coin/Qwsogvtv82FCd/history",
  params: {
    referenceCurrencyUuid: "zNZHO_Sjf",
    timePeriod: "24h",
  },
  headers: {
    "x-rapidapi-key": "b814dd8973msh506c02d4e42a0cfp135d63jsnb3ab0fd30f02",
    "x-rapidapi-host": "coinranking1.p.rapidapi.com",
  },
};

try {
  const response = async () => {
    const res = await axios.request(options);
     console.log(res.data);
  };

  response();

} catch (error) {
  console.error(error);
}
