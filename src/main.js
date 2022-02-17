const LIST_MIN_LIMIT = 10;
const DEFAULT_FIAT = 'USD';
const DEFAULT_INTERVAL_MS = 10000;
const MIN_INTERVAL_MS = 3000;

this.app = new Vue({
  el: '#app',
  data: {
    currencies: [],
    fiats: [DEFAULT_FIAT],
    currentFiat: null,
    limit: LIST_MIN_LIMIT,
    isFetchingCurrencies: false,
    fetchInterval: DEFAULT_INTERVAL_MS,
  },
  methods: {
    async fetchList() {
      this.isFetchingCurrencies = true;

      this.currencies = await this.$api.getDailyTop(
        this.currentFiat,
        this.limit
      );

      this.isFetchingCurrencies = false;
    },
    async changeFiat(index) {
      this.currentFiat = this.fiats[index];
      return this.fetchList();
    },
  },
  async mounted() {
    const parameters = JSON.parse(this.$el.dataset.atts);

    const limitNum = Number(parameters.limit);
    if (limitNum > LIST_MIN_LIMIT) {
      this.limit = limitNum;
    }

    const intervalNum = Number(parameters.interval);
    if(intervalNum >= MIN_INTERVAL_MS) {
      this.fetchInterval = intervalNum;
    }

    if (parameters.fiats) {
      const filteredFiats = parameters.fiats
        .split(new RegExp('[^A-Za-z]+'))
        .filter(Boolean);

      if (filteredFiats.length) {
        this.fiats = filteredFiats.map((fiat) => fiat.toUpperCase());
      }
    }

    this.currentFiat = this.fiats[0];

    setInterval(this.fetchList, this.fetchInterval);
    await this.fetchList();
  },
});
