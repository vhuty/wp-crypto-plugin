class Api {
  async getDailyTop(fiat = 'USD', limit = 10) {
    const url = new URL(`${Vue.apiConfig.API_URL}/top/totalvolfull`);
    url.searchParams.append('tsym', fiat);
    url.searchParams.append('limit', limit);

    const { data, error } = await this.makeApiCall(url.href);

    if (error) {
      console.error(error.message);

      if (error.parameter === 'tsym') {
        alert(`WpCryptoPlugin: Invalid fiat specfified "${fiat}"`);
      }

      return [];
    }

    return data.map(this.fromFullFormat);
  }

  async makeApiCall(url) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Apikey ${Vue.apiConfig.API_KEY}`,
        Accept: 'application/json',
      },
      mode: 'cors',
    });

    const { Data, Response, Message, ParamWithError } = await response.json();

    if (Response === 'Error') {
      return { 
        error: { 
          message: Message, 
          parameter: ParamWithError,
        }, 
      };
    }

    return { data: Data };
  }

  fromFullFormat(currency) {
    const { CoinInfo, DISPLAY } = currency;

    const display = Object.values(DISPLAY).shift();

    return {
      name: CoinInfo.Name,
      fullName: CoinInfo.FullName,
      price: display.PRICE,
      dailyPercent: display.CHANGEPCT24HOUR,
      image: CoinInfo.ImageUrl,
    };
  }
}

Vue.api = Vue.prototype.$api = new Api();
