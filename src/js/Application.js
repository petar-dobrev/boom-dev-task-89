import EventEmitter from "eventemitter3";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();

    const button = document.querySelector(".button");
    button.addEventListener("click", () => {
      alert("💣");
    });

    this.apiURL = "https://swapi.boom.dev/api/planets";

    this.planetsContainer = document.querySelector(".planets-container");
    this._loading = document.querySelector(".progress");

    this.planets = [];

    this._render();

    this.emit(Application.events.READY);
  }

  async _load() {
    const response = await fetch(this.apiURL);
    const data = await response.json();
    this.planets.push(...data.results);
    this._checkApiForNextPage(data.next);
    (await this._checkApiForNextPage(data.next))
      ? this._load()
      : await this._create();
  }

  async _checkApiForNextPage(nextPageUrl) {
    if (nextPageUrl != null) {
      this.apiURL = nextPageUrl;
      return true;
    }
    return false;
  }

  async _create() {
    console.log(this.planets);
    this.planets.forEach((planet) => {
      const planetEl = document.createElement("p");
      planetEl.classList.add("planet");
      planetEl.innerText = planet.name;
      this.planetsContainer.appendChild(planetEl);
    });
    console.log("create");
  }

  async _startLoading() {
    await this._load();
    this._loading.style.visibility = "visible";

  }

  async _stopLoading() {
    this._loading.style.visibility = "hidden";
  }

  async _render() {
    await this._startLoading();
    await this._stopLoading();
  }
}
