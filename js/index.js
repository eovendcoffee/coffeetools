import { stations } from "./db.js";

const inpStation = document.querySelector('.js-station');
const inpNum = document.querySelector('.js-number');
const places = document.querySelector('.js-places');
const loader = document.querySelector('.js-loader');
const notFound = document.querySelector('.js-not-found');
const showAllBtn = document.querySelector('.js-show-all');
const allQuant = showAllBtn.querySelector('.js-quant');

let showAllFlag = false;

allQuant.textContent = stations.length;

function debounce(callee, timeoutMs) {
  return function perform(...args) {
    let previousCall = this.lastCall

    this.lastCall = Date.now()

    if (previousCall && this.lastCall - previousCall <= timeoutMs) {
      clearTimeout(this.lastCallTimer)
    }

    this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs)
  }
}

function findStations(stat, num) {
    const findedStArr = stations.filter((el) => {

        if (stat && num) {
            return el.name.toLowerCase().includes(stat.toLowerCase()) && el.number.toLowerCase().includes(num.toLowerCase());
        }

        if (!num) {
            return el.name.toLowerCase().includes(stat.toLowerCase());
        }

        if (!stat) {
            return el.number.toLowerCase().includes(num.toLowerCase());
        }

    });

    return findedStArr
}

function cleanPlaces() {
    places.textContent = '';
}

function getPlaceTemplate() {
    const temp = document.querySelector('.js-template');
    const placeTemp = temp.cloneNode(true);
    return placeTemp.content;
}

function preparePlace(placeObj, i) {
    const placeTemp = getPlaceTemplate();
    const title = placeTemp.querySelector('.js-place-title');
    const listNum = placeTemp.querySelector('.js-list-num');
    const num = placeTemp.querySelector('.js-place-num');
    const enter = placeTemp.querySelector('.js-place-enter');
    const drive = placeTemp.querySelector('.js-place-drive');
    const parking = placeTemp.querySelector('.js-place-parking');
    const descr = placeTemp.querySelector('.js-place-descr');

    listNum.textContent = i + 1;
    title.textContent = placeObj.name;
    num.textContent = placeObj.number;

    if (placeObj.place) {
        const link = enter.querySelector('.js-place-link');
        link.href = `${placeObj.place}`;
    } else {
        enter.querySelector('.js-place-link').remove();
    }

    if (placeObj.drive) {
        const link = drive.querySelector('.js-place-link');
        link.href = placeObj.drive;
    } else {
        drive.remove();
    }

    if (placeObj.parking) {
        const link = parking.querySelector('.js-place-link');
        link.href = placeObj.parking;
    } else {
        parking.remove();
    }

    if (!placeObj.place && !placeObj.drive && !placeObj.parking && !placeObj.descr) {
        const text = descr.querySelector('.js-place-descr-text');
        text.textContent = 'Точка находится на уточнении';
        enter.remove();
    } else if (placeObj.descr) {
        const text = descr.querySelector('.js-place-descr-text');
        text.textContent = placeObj.descr;
    } else {
        descr.remove();
    }

    return placeTemp;
}

function printPlaces(placesArr) {
    cleanPlaces();

    placesArr.forEach((el, i) => {
        const placeEl = preparePlace(el, i);
        places.append(placeEl);
    });
}

const onInpPrint = debounce(function () {
    cleanPlaces();
    loader.style.display = 'block';

    setTimeout(() => {
        if ((!inpStation.value.trim() && !inpNum.value.trim())) {
            cleanPlaces();
            loader.style.display = 'none';
            notFound.style.display = 'none';
            return;
        }
    
        const stationsArr = findStations(inpStation.value.trim(), inpNum.value.trim());
    
        if (stationsArr.length) {
            notFound.style.display = 'none';
            printPlaces(stationsArr);
        } else {
            notFound.style.display = 'block';
        }

        loader.style.display = 'none';
    }, 500);
}, 200);

function onShowAllClick() {
    if (!showAllFlag) {
        showAllBtn.classList.remove('all-hidden');
        printPlaces(stations);
    } else {
        showAllBtn.classList.add('all-hidden');
        cleanPlaces();
    }

    showAllFlag = !showAllFlag;
}

inpStation.addEventListener('input', onInpPrint);
inpNum.addEventListener('input', onInpPrint);
showAllBtn.addEventListener('click', onShowAllClick)
