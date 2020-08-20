/*     let root = document.documentElement;
    root.addEventListener('click' , e=> {
        root.style.setProperty('--main-bg-color', "red");
        root.style.setProperty('--main-font-color', "blue");
    })
 */
/*NOT MY CODE START*/
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
/*NOT MY CODE END*/

function percentOf(x , y) {
    let n = (y / x) * 100;
    return n.toFixed(2);
} 

function thousand(x) {
    if(x > 1000) {
        return `${(x/1000)}k`
    }else {
        return x
    }

}



const info_container_today = document.querySelector('#info_container_today');
const info_container_aT = document.querySelector('#info_container_aT');
const info_container_global = document.querySelector('#info_container_global');

const country_container = document.querySelector('#country_container');

const country_heading = document.querySelector('#country-heading');
const world_heading = document.querySelector('#world-heading');

const world_container = document.querySelector('#world_container');

const btn_1 = document.querySelector('#btn-1');
const btn_2 = document.querySelector('#btn-2');
const btn_3 = document.querySelector('#btn-3');

const selector_countryCode = document.querySelectorAll('.selector_countryCode');



btn_1.addEventListener('click' , e=> {
    btn_2.classList.remove('selected');
    btn_3.classList.remove('selected');
    btn_1.classList.add('selected');

    country_container.style.display = "";
    world_container.style.display = "none";

    info_container_today.style.display = "block";
    info_container_aT.style.display = "none";
    info_container_global.style.display = "none";

})
btn_2.addEventListener('click' , e=> {
    btn_1.classList.remove('selected');
    btn_3.classList.remove('selected');
    btn_2.classList.add('selected');

    country_container.style.display = "";
    world_container.style.display = "none";

    info_container_today.style.display ="none"  ;
    info_container_aT.style.display = "block";
    info_container_global.style.display = "none";
})
btn_3.addEventListener('click' , e=> {
    btn_1.classList.remove('selected');
    btn_2.classList.remove('selected');
    btn_3.classList.add('selected');

    country_container.style.display = "none";
    world_container.style.display = "block";

    info_container_today.style.display ="none";
    info_container_aT.style.display = "none";
    info_container_global.style.display = "";
})

console.log(info_container_global)

const covidInfo = async () => {
    const base = 'https://api.covid19api.com/summary';
    const response = await fetch(base);
    const dataArray = await response.json();
    return dataArray;

}
const userIp = async () => {
    const base = "https://api.ipify.org/?format=json";
    const response = await fetch(base);
    const user_ip_json = await response.json();

    return user_ip_json;
}

const userCountry = async (ip) => {
    /*secure connect 
    https://ip-api.com/#103.231.231.22
    */
    const base = `http://ip-api.com/json/${ip}`;
    const response = await fetch(base);
    const user_country_json = await response.json();

    return user_country_json;
 }

userIp()
    .then(data_ip => {
        const user_ip = data_ip.ip;
        //USER IP
        console.log(user_ip);

        userCountry(user_ip)
         .then(data_country => {
            const userCountryCode = data_country.countryCode;
            selector_countryCode.forEach(item => {
                item.innerHTML = `(${userCountryCode})`
            })

            //COUNTRY CODE
            console.log(userCountryCode)

            covidInfo()
             .then(data_covid => {
                 const global = data_covid.Global;
                 console.log(global)
                 info_container_global.innerHTML = 
                 
                 `
                 <div class="global_header global_header-1">
                    <div class="global_header-text">Today 🌐</div>
                    <div class="">New Cases : <span>${numberWithCommas(global.NewConfirmed)}</span></div>
                    <div class="">Recovered : <span class="green">${numberWithCommas(global.NewRecovered)}</span></div>
                    <div class="">Deaths : <span class="red">${numberWithCommas(global.NewDeaths)}</span></div>
                </div>
       
                <div class="global_header global_header-2">
                    <div class="global_header-text">All Time 🌐</div>
                    <div class="">Total Cases : <span>${numberWithCommas(global.TotalConfirmed)}</span> </div>
                    <div class="">Recovered : <span class="green">${numberWithCommas(global.TotalRecovered)}</span></div>
                    <div class="">Deaths : <span class="red">${numberWithCommas(global.TotalDeaths)}</span></div> 
                </div>

                 `;


                const countryArray = data_covid.Countries;
                const filterArray = countryArray.filter(country => {
                        return country.CountryCode === userCountryCode;
                })
                const currentCountry = filterArray[0];
                console.log(currentCountry);

                country_container.innerHTML = 
                `
                <h2 class="country_name">${currentCountry.Country}</h2>
                <img src="https://www.countryflags.io/${currentCountry.CountryCode}/flat/24.png" alt="" srcset="">
                `;

                info_container_today.innerHTML = 
                `
                <div>New Cases : <span>${numberWithCommas(currentCountry.NewConfirmed)}</span> </div>
                <div>Recovered : <span class="green">${numberWithCommas(currentCountry.NewRecovered)}</span> </div>
                <div>Deaths : <span class="red">${numberWithCommas(currentCountry.NewDeaths)}</span></div>

                `;
                info_container_aT.innerHTML = 
                `
                <div>Total Cases : <span>${numberWithCommas(currentCountry.TotalConfirmed)}</span> </div>
                <div class="recovered-div" recovered">Recovered : <span class="green">${numberWithCommas(currentCountry.TotalRecovered)}</span> </div>
                <div class="recovered-p-div">Recovery Rate : <span class="green">${percentOf(currentCountry.TotalConfirmed , currentCountry.TotalRecovered)}</span>%</div>
                <div>Deaths : <span class="red">${numberWithCommas(currentCountry.TotalDeaths)}</span></div>
                <div>Death Rate : <span class="red">${percentOf(currentCountry.TotalConfirmed , currentCountry.TotalDeaths)}</span>%</div>

                `;



             })

             
        })


    })
    