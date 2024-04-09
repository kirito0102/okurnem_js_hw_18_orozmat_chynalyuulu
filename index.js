
async function addEntry() {
  const countryInput = document.getElementById("countryInput").value.trim();
  const visitDate = document.getElementById("visitDate").value;
  
  if (countryInput === "" || visitDate === "") {
      alert("Пожалуйста, введите название страны и выберите дату посещения.");
      return;
  }

  try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
      const countriesData = await response.json();
      
      const country = countriesData.find(country => country.name.common.toLowerCase() === countryInput.toLowerCase());
      if (!country) {
          alert("Страна не найдена.");
          return;
      }
      
      const flagURL = country.flags.svg;
      
      const entry = {
          country: country.name.common,
          flag: flagURL,
          date: visitDate
      };
      
      let entries = JSON.parse(localStorage.getItem("entries")) || [];
      entries.push(entry);
      localStorage.setItem("entries", JSON.stringify(entries));
      
      displayEntries();
  } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      alert("Произошла ошибка при загрузке данных.");
  }
}

function displayEntries() {
  const entriesList = document.getElementById("entriesList");
  entriesList.innerHTML = "";
  
  let entries = JSON.parse(localStorage.getItem("entries")) || [];
  
  
  entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  entries.forEach(entry => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
          <img src="${entry.flag}" alt="${entry.country}">
          <span>${entry.country}</span>
          <span>${entry.date}</span>
          <button onclick="removeEntry('${entry.country}', '${entry.date}')">x</button>
      `;
      entriesList.appendChild(card);
  });
}

function removeEntry(country, date) {
  let entries = JSON.parse(localStorage.getItem("entries")) || [];
  entries = entries.filter(entry => entry.country !== country || entry.date !== date);
  localStorage.setItem("entries", JSON.stringify(entries));
  displayEntries();
}

displayEntries();
