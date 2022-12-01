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

    const planetsContainer = document.querySelector(".planets-container");
    const _loading = document.createElement("progress");

    let planets = [];

    const _load = async () => {
      const apiURL = "https://swapi.boom.dev/api/planets";
      const response = await fetch(apiURL);
      const data = await response.json();
      planets.push(data.results);
    };

    const _create = async () => {
      console.log(planets);
      planets[0].forEach((planet) => {
        const planetEl = document.createElement("p");
        planetEl.classList.add("planet");
        planetEl.innerText = planet.name;
        planetsContainer.appendChild(planetEl);
      });
    };

    const _startLoading = async () => {
      planetsContainer.appendChild(_loading);
      await _load();
      await _create();
    };

    const _stopLoading = () => {
      planetsContainer.removeChild(_loading);
    };

    _startLoading().then(_stopLoading);

    this.emit(Application.events.READY);
  }
}
