"use strict";

const api_key = "213675403267412447857x116732";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

const renderCountry = function (data, className = "") {
  const html = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flag}" />
      <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)}</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
      </div>
  </article>`;

  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
  countriesContainer.style.opacity = 1;
};

///////////////////////////////////////

//* Old way
// const getCountryData = function (country) {
//   const request = new XMLHttpRequest();
//   request.open(
//     "GET",
//     `https://countries-api-836d.onrender.com/countries/name/${country}`
//   );
//   request.send();

//   request.addEventListener("load", function () {
//     console.log(this.responseText);

//     const [data] = JSON.parse(this.responseText);
//     console.log(data);

//     const html = `
//     <article class="country">
//       <img class="country__img" src="${data.flag}" />
//       <div class="country__data">
//         <h3 class="country__name">${data.name}</h3>
//         <h4 class="country__region">${data.region}</h4>
//         <p class="country__row"><span>👫</span>${(
//           +data.population / 1000000
//         ).toFixed(1)}</p>
//         <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
//         <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
//       </div>
//   </article>`;

//     countriesContainer.insertAdjacentHTML("beforeend", html);
//     countriesContainer.style.opacity = 1;
//   });
// };

// const getCountryAndNeighbor = function (country) {

//   // AJAX call country 1
//   const request = new XMLHttpRequest();
//   request.open(
//     "GET",
//     `https://countries-api-836d.onrender.com/countries/name/${country}`
//   );
//   request.send();

//   request.addEventListener("load", function () {
//     console.log(this.responseText);

//     const [data] = JSON.parse(this.responseText);
//     console.log(data);

//     // Render country 1
//     renderCountry(data);

//     // Get neighbor country (2)
//     const [neighbor] = data.borders;
//     if(!neighbor) return;

//     // AJAX call country 2
//     const request2 = new XMLHttpRequest();
//     request2.open("GET", `https://countries-api-836d.onrender.com/countries/alpha/${neighbor}`);
//     request2.send();

//     request2.addEventListener("load", function () {
//       const neighbor_data = JSON.parse(this.responseText);
//       renderCountry(neighbor_data, "neighbor");
//     })
//   })
// };

// getCountryAndNeighbor("usa");

const getJSON = function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

getPosition().then((pos) => console.log(pos));

//? Coding Challenge
// const whereAmI = function () {
//   getPosition()
//     .then((pos) => {
//       const { latitude: lat, longitude: lng } = pos.coords;

//       return fetch(
//         `https://geocode.xyz/${lat},${lng}?geoit=json&auth=${api_key}`
//       );
//     })
//     .then((response) => {
//       if (!response.ok)
//         throw new Error(`Something went wrong (${response.status})`);

//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//       console.log(`You are in ${data.city}, ${data.country}`);

//       return fetch(
//         `https://countries-api-836d.onrender.com/countries/name/${data.country}`
//       );
//     })
//     .then((response) => {
//       if (!response.ok)
//         throw new Error(`Country not found (${response.status})`);

//       return response.json();
//     })
//     .then((data) => renderCountry(data[0]))
//     .catch((err) => {
//       console.error(err.message);
//     });
// };

//* New way
const getCountryData = function (country) {
  // Country 1
  getJSON(
    `https://countries-api-836d.onrender.com/countries/name/${country}`,
    "Country Not Found"
  )
    .then((data) => {
      renderCountry(data[0]);
      const neighbor = data[0].borders[0];

      if (!neighbor) throw new Error(`No neighbor found!`);

      // Country 2
      return getJSON(
        `https://countries-api-836d.onrender.com/countries/alpha/${neighbor}`,
        "Country Not Found"
      );
    })
    .then((data) => renderCountry(data, "neighbor"))
    .catch((err) => {
      console.error(err);
      renderError(`Something went wrong -> ${err.message}`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

//? Coding challenge
const imgContainer = document.querySelector(".images");

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const image = document.createElement("img");
    image.src = imgPath;

    image.addEventListener("load", function () {
      imgContainer.append(image);
      resolve(image);
    });

    image.addEventListener("error", function () {
      reject(new Error("Image not found"));
    });
  });
};

// let currentImage;

// createImage("/test8/static/images/img-1.jpg")
//   .then((img) => {
//     currentImage = img;
//     console.log("Image 1 loaded");
//     return wait(2);
//   })
//   .then(() => {
//     currentImage.style.display = "none";
//     return createImage("/test8/static/images/img-2.jpg");
//   })
//   .then((img) => {
//     currentImage = img;
//     console.log("Image 2 loaded");
//     return wait(2);
//   })
//   .then(() => {
//     currentImage.style.display = "none";
//   })
//   .catch((err) => console.error(err));

//? =================================================================

// btn.addEventListener("click", function () {
//   getCountryData("usa");
// });

// btn.addEventListener("click", function () {
//   whereAmI(41.902, 12.496);
// });

// console.log("Test Start");
// setTimeout(() => console.log("0 sec timer"), 0);
// Promise.resolve("Resolved promise 1").then((res) => console.log(res));
// // Promise.resolve("Resolved promise 2").then(res => {
// //   for (let i = 0; i < 10000000000; i++) {}
// //   console.log(res);
// // });
// console.log("Test End");

// const lotteryPromise = new Promise(function (resolve, reject) {
//   console.log("Lottery draw is happening");
//   setTimeout(function () {
//     if (Math.random() >= 0.5) {
//       resolve("You Won");
//     } else {
//       reject(new Error("You Lost"));
//     }
//   }, 2000);
// });

// lotteryPromise
//   .then((res) => console.log(res))
//   .catch((err) => console.error(err));

// // Convert a callback function into a Promise (setTimeout)

// wait(2)
//   .then(() => {
//     console.log("I waited for 2 seconds");
//     return wait(1);
//   })
//   .then(() => console.log("I waited for 1 second"));

//* Async-Await
const whereAmI = async function () {
  try {
    // Geolocation
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    // Reverse geocoding
    const resGeo = await fetch(
      `https://geocode.xyz/${lat},${lng}?geoit=json&auth=${api_key}`
    );

    if (!resGeo.ok) throw new Error("Problem getting location data");

    const dataGeo = await resGeo.json();

    // Country data
    const res = await fetch(
      `https://countries-api-836d.onrender.com/countries/name/${dataGeo.country}`
    );

    if (!res.ok) throw new Error("Problem getting country");

    const data = await res.json();
    renderCountry(data[0]);

    return `You are in ${dataGeo.city}, ${dataGeo.country}`;
  } catch (err) {
    renderError(err.message);

    // Reject promise returned from ASYNC function
    throw err;
  }
};

btn.addEventListener("click", function () {
  whereAmI();
});

//* Returning values from ASYNC function
// console.log("1: Will get location");
// const city = whereAmI();
// console.log(city);
// whereAmI().then(city => console.log(city))
// .catch(err => console.error(`2: ${err.message}))
// .finally(() => console.log("3: Finished getting location"));

//* Return data with ASYNC-AWAIT functions (IIFE)
// (async function() {
//   try {

//   const city = await whereAmI();
//   console.log(`2: ${city}`);

//   } catch (err) {
//     console.error(`2: ${err.message}`);
//   }
//   console.log("3: Finished getting location");
// })();

const get3Countries = async function (c1, c2, c3) {
  try {
    const data = await Promise.all([
      getJSON(`https://countries-api-836d.onrender.com/countries/name/${c1}`),
      getJSON(`https://countries-api-836d.onrender.com/countries/name/${c2}`),
      getJSON(`https://countries-api-836d.onrender.com/countries/name/${c3}`),
    ]);

    console.log(data.map((d) => d[0].capital));
  } catch (err) {
    console.error(err);
  }
};

get3Countries("usa", "canada", "italy");

//* Promise.race(as soon as a promise is settled it gets fulfilled)
(async function () {
  const res = await Promise.race([
    getJSON(`https://countries-api-836d.onrender.com/countries/name/italy`),
    getJSON(`https://countries-api-836d.onrender.com/countries/name/mexico`),
    getJSON(`https://countries-api-836d.onrender.com/countries/name/egypt`),
  ]);
});

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error("Request took too long"));
    }, sec * 1000);
  });
};

Promise.race([
  getJSON(`https://countries-api-836d.onrender.com/countries/name/germany`),
  timeout(1),
])
  .then((res) => console.log(res[0]))
  .catch((err) => console.error(err));

//* Promise.allSettled(returns an array of all settled promises without stopping at the first reject)
// Promise.allSettled([
//   Promise.resolve("Success"),
//   Promise.reject("Error"),
//   Promise.resolve("Another Success"),
// ])
// .then(res => console.log(res))
// .catch(err => console.error(err));

//* Promise.any(returns the first fulfilled promise, rejected are ignored)
// Promise.allSettled([
//   Promise.resolve("Success"),
//   Promise.reject("Error"),
//   Promise.resolve("Another Success"),
// ])
//   .then((res) => console.log(res))
//   .catch((err) => console.error(err));

//? Coding challenge
// const imgContainer = document.querySelector(".images");

// const loadNPause = async function () {
//   try {
//     // Load image 1
//     let image = await createImage("/test8/static/images/img-1.jpg");
//     console.log("Image 1 loaded");
//     await wait(2);
//     image.style.display = "none";

//     image = await createImage("/test8/static/images/img-2.jpg");
//     console.log("Image 2 loaded");
//     await wait(2);
//     image.style.display = "none";

//     image = await createImage("/test8/static/images/img-3.jpg");
//     console.log("Image 3 loaded");
//     await wait(2);
//     image.style.display = "none";

//   } catch (err) {
//     console.error("Image not found!");
//   }
// };

// loadNPause()

// const loadAll = async function (imgArr) {
//   try {
//     const imgs = imgArr.map(async (img) => await createImage(img));

//     const imgsEl = await Promise.all(imgs);
//     console.log(imgsEl);
//     imgsEl.forEach(img => img.classList.add("parallel"))
//   } catch (err) {
//     console.error(err);
//   }
// };

// loadAll([
//   "/test8/static/images/img-1.jpg",
//   "/test8/static/images/img-2.jpg",
//   "/test8/static/images/img-3.jpg",
// ]);

//? =================================================================
