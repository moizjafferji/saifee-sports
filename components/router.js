function loadHomePage() {
  document.getElementById("navbar").innerHTML = `
    <nav>
      <button onclick="loadProfile()">Profile</button>
      <button onclick="loadBalance()">Balance</button>
      <button onclick="loadCalendar()">Calendar</button>
      <button onclick="loadGuests()">Guests</button>
    </nav>
  `;
  document.getElementById("main-content").innerHTML = `<h2>Welcome, ${userSession.name}</h2>`;
}

function loadProfile() {
  document.getElementById("main-content").innerHTML = `<p>Loading profile...</p>`;
  // Will connect to backend soon
}
