import { XRapidAPIHost, XRapidAPIKey, XRapidAPIHostNews } from "./api";

import axios from "axios";

// ENDPOINTS
const baseUrl = "https://coinranking1.p.rapidapi.com";

const coinsUrl = `${baseUrl}/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers[0]=1&orderBy=marketCap&orderDirection=desc&limit=30&offset=0`;

const newsUrl = "https://cryptocurrency-news2.p.rapidapi.com/v1/coindesk/";

const CryptoApiCall = async (endpoints, params) => {
  const options = {
    method: "GET",
    url: endpoints,
    params:params ? params : {},
    headers: {
      "X-RapidAPI-Key": `${XRapidAPIKey}`,
      "X-RapidAPI-Host": `${XRapidAPIHost}`,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.log(error.message);
    return {};
  }
};


const NewsApiCall = async (endpoints) => {
  const options = {
    method: "GET",
    url: endpoints,
    headers: {
      "X-RapidAPI-Key": `${XRapidAPIKey}`,
      "X-RapidAPI-Host": `${XRapidAPIHostNews}`,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.log(error);
    return {};
  }

};

export const getAllCoins = async () => {
  return await CryptoApiCall(coinsUrl);
};

export const getCoinDetails = async (coinUuid) => {
  const endpoints = `${baseUrl}/coin/${coinUuid}?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h`;

  return await CryptoApiCall(endpoints);
};

export const getCoinHistory = async (coinUuid) => {
  const endpoints = `https://coinranking1.p.rapidapi.com/coin/${coinUuid}/history`;

  try{
    return await CryptoApiCall(endpoints);
  }catch(error){
    console.log("Get Coin History func error -> ", error);
  }

};


export const SearchCoin = async (search) => {
  const endpoints = `${baseUrl}/search-suggestions?referenceCurrencyUuid=yhjMzLPhuIDl&query=${search}`;
  return await CryptoApiCall(endpoints);
}

export const getCryptoNews = async () => {
  return await NewsApiCall(newsUrl);
}