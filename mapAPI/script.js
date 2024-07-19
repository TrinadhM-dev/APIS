'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout{
    date = new Date();
    id = (Date.now()+ '').slice(-10);
    constructor(coords,distance,duration){
        this.coords = coords;
        this.distance = distance; //in km
        this.duration = duration; //in min
    }
}

class Running extends Workout{
    type='running';
    constructor(coords,distance,duration,cadence){
        super(coords,distance,duration);
        this.cadence = cadence;
        this.calcPace();
    }
    calcPace(){
        //mins/dis
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}

class Cycling extends Workout{
    type='cycling';
    constructor(coords,distance,duration,elevationGain){
        super(coords,distance,duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
    }
    calcSpeed(){
        //mins/dis
        this.speed = this.distance / this.duration;
        return this.speed;
    }
}

const run1 = new Running([39,-12],5.2,24,178);
const cycle1 = new Cycling([39,-12],27,95,523);

console.log(run1,cycle1);

/////////////////////////////
//Application Architecture
////////////////////////////
class App{
    #map;
    #mapEvent;
    #workout=[];

    constructor(){
 this._getPosition();
      form.addEventListener('submit', this._newWorkout.bind(this))
      inputType.addEventListener('change', this._toggleElevationField ) 
    }

    _getPosition(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
                    alert(`Could not fetch the current location`)
                })
        }
    }
    _loadMap(position){
            const {latitude} = position.coords;
            const {longitude} = position.coords;
            console.log(`https://www.google.com/maps/@${latitude},${longitude},15z?entry=ttu`);
            const cords = [latitude, longitude]
            this.#map = L.map('map').setView(cords, 13);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.#map);
            // L.marker(cords).addTo(map).bindPopup(' A pretty css Map').openPopup();
console.log(this);
            //Adding the functionality if we click on the any location in the map
            this.#map.on('click', this._showForm.bind(this))
        }

    _showForm(mapE){
            this.#mapEvent = mapE
            form.classList.remove('hidden');
            inputDistance.focus();
    }

    _toggleElevationField() {
        //Hidden Form Active if we are cycling
      
            inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
            inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(e){
        const validInputs = (...inputs) =>
            inputs.every(inp => Number.isFinite(inp));
        const allPositive = (...inputs) => inputs.every(inp => inp>0);
        e.preventDefault();

        //Get a Data From Form
        const type= inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const { lat, lng } = this.#mapEvent.latlng;
        let workout;

        //if workout running, create running object

        if(type === 'running'){
            const cadence = +inputCadence.value;
            
        if(!validInputs(distance,duration,cadence) || !allPositive(distance,duration,cadence) ) {
            return alert('Inputs have to be Positive Numbers!');

        }
         workout = new Running([lat,lng],distance,duration,cadence);
   
        }

        //if workout cycling, create cycling object
        if(type === 'cycling'){
            const elevation = +inputElevation.value;
     
        //Check if the data is valid

        // if(!Number.isFinite(distance) || !Number.isFinite(duration) || !Number.isFinite(elevation))
            if(!validInputs(distance,duration,elevation)|| !allPositive(distance,duration)){
            return alert('Inputs have to be Positive Numbers!');
        }
        workout = new Running([lat,lng],distance,duration,elevation);
    }
        //Add new object to wrkout Array
        this.#workout.push(workout);

        //Render wrkout on map as marker
        L.marker(workout.coords).addTo(this.#map).bindPopup(L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: ` ${type}-popup `
        }))
            .setPopupContent(`${type}`)
            .openPopup();
        //Render workout as list

this._renderWorkout(workout);
        //Hide form + clear input Fields
        inputDuration.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
        //Display Marker
    }
    _renderWorkout(workout){

    }
}

const app = new App();
//Display Marker
