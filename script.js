/**
 * STEPS:
 * 1. create a requestController class and define the needed variables for the API call
 * 2. Create a method that will get the current (last added) comic and set the currentComicsNumber and
 *    maxComicsNumber accordingly, call that method on load
 * 3. Register an event for the random comic number and add all the chain of event to display it
 * 4. Add Previous/Next, First/Last and get Comic by ID functionality to the app
 * 5. Adjust UI states accordingly
 */

class RequestController {
  constructor() {
    this.DomInterface = new DomInterface();
    this.corsHeader = 'https://the-ultimate-api-challenge.herokuapp.com';
    this.apiUrl = 'http://xkcd.com';
    this.apiUrlFormat = 'info.0.json';
    this.superagent = superagent;
    this.currentComicsNumber = 0;
    this.maxComicsNumber = 0;

    this.getCurrentCommics();
    this.registerEvents();
  }

  setCurrentComicsNumber(number) {
    this.currentComicsNumber = number;
  }

  setMaxComicsNumber(number) {
    this.maxComicsNumber = number;
  }

  getRandomComicNumber() {
    const min = 1;
    const max = this.maxComicsNumber;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  }

  getCurrentCommics() {
    const requestUrl = `${this.corsHeader}/${this.apiUrl}/${this.apiUrlFormat}`;

    this.superagent.get(requestUrl).end((error, response) => {
      if (error) {
        return this.DomInterface.showError(error);
      }
      const data = response.body;
      this.setMaxComicsNumber(data.num);
      this.setCurrentComicsNumber(data.num);
      this.DomInterface.showComics(data);
    });
  }

  getComicsByNumber(number) {
    const requestUrl = `${this.corsHeader}/${this.apiUrl}/${number}/${this.apiUrlFormat}`;

    this.superagent.get(requestUrl).end((error, response) => {
      if (error) {
        return this.DomInterface.showError(error);
      }
      const data = response.body;
      this.setCurrentComicsNumber(data.num);
      this.DomInterface.showComics(data);
    });
  }

  requestPreviousComics() {
    const requestedComicsNumber = this.currentComicsNumber - 1;
    console.log(requestedComicsNumber);

    if (requestedComicsNumber < 1) return;
    this.getComicsByNumber(requestedComicsNumber);
  }

  requestNextComics() {
    const requestedComicsNumber = this.currentComicsNumber + 1;

    if (requestedComicsNumber > this.maxComicsNumber) return;
    this.getComicsByNumber(requestedComicsNumber);
  }

  registerEvents() {
    this.DomInterface.controls.random.addEventListener('click', () =>
      this.getComicsByNumber(this.getRandomComicNumber())
    );

    this.DomInterface.controls.first.addEventListener('click', () => {
      this.getComicsByNumber(1);
    });
    this.DomInterface.controls.last.addEventListener('click', () => {
      this.getComicsByNumber(this.maxComicsNumber);
    });

    this.DomInterface.controls.previous.addEventListener('click', () => this.requestPreviousComics());
    this.DomInterface.controls.next.addEventListener('click', () => this.requestNextComics());
  }
}

const comics = new RequestController();
