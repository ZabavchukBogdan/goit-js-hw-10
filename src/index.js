import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './modules/fetch_countries';


const DEBOUNCE_DELAY = 300;

const search = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


search.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
    if (!search.value) {
        deleteMurkup();
        }
    if (search.value) {
        fetchCountries(search.value.trim())
            .then((data) => {
                createMurkup(data);
            })
            .catch(error => {
                deleteMurkup();
                Notiflix.Notify.failure('Oops, there is no country with that name');
            });
    }
}



 function createCardCountries(data) {
    return data.map(({ name, flags, capital, population, languages }) =>
        `<p class="country-name"><img src="${flags.png}" alt="${name}" width ="80">${name.official}</p>
        <p style="font-weight: bold">Capital: <span style="font-weight: normal">${capital}</span></p>
        <p style="font-weight: bold">Population: <span style="font-weight: normal">${population}</span></p>
        <p style="font-weight: bold">Languages: <span style="font-weight: normal">${Object.values(languages)}</span></p>`)
        .join('');
}



function createMurkup(data) {
    if (data.length === 1) {
        deleteMurkup();
        countryInfo.insertAdjacentHTML('beforeend', createCardCountries(data))
    } else if (data.length >= 2 && data.length <= 10) {
        deleteMurkup();
        countryList.insertAdjacentHTML('beforeend', createList(data))
    } else {
        Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    }
};


 function createList(data) {
    return data.map(({ name, flags }) =>
    `<li class = "country-item">
        <img src="${flags.png}" alt="flag" width="40">
      <p>${name.official}</p>
    </li>`).join('');
};




function deleteMurkup() {
    if (countryList) {
        countryList.innerHTML = '';
    }
    if (countryInfo) {
        countryInfo.innerHTML = '';
    }
    return;
}
