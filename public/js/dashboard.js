// dashboard.js

// Connect to the Socket.IO server
const socket = io();

let allPoles = []; // Store all poles data

// Function to fetch and display poles
async function fetchPoles() {
  try {
    const response = await fetch('/poles'); // Assuming your Express route for getting poles is '/poles'
    allPoles = await response.json();
    filterPoles('all');
  } catch (err) {
    console.error('Error fetching poles:', err);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await fetchPoles();
  fetchSystemStatus(); // Fetch and display poles
  requestNotificationPermission();
   // Request notification permission
});

// Function to request notification permission
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted');
      }
    });
  }
}

// Listen for 'poleUpdate' events from the Socket.IO server and update the list
socket.on('poleUpdate', (updatedPole) => {
  const index = allPoles.findIndex(pole => pole.poleId === updatedPole.poleId);
  if (index !== -1) {
    const oldStatus = allPoles[index].status; // Get the old status
    allPoles[index] = updatedPole;
    filterPoles('all');

    // Check if the updated pole's status has changed
    if (oldStatus !== updatedPole.status) {
      // Display Chrome push notification
      const notificationTitle = updatedPole.status === 'active' ? 'Pole Activated' : 'Pole Deactivated';
      const notificationBody = `Pole ID ${updatedPole.poleId} has become ${updatedPole.status}.`;
      displayNotification(notificationTitle, { body: notificationBody });
    }
  }
});

// Function to filter poles based on status
function filterPoles(status) {
  const filteredPoles = status === 'all' ? allPoles : allPoles.filter(pole => pole.status === status);
  displayPoles(filteredPoles);
}

// Function to display poles
function displayPoles(poles) {
  const poleList = document.getElementById('poleList');
  poleList.innerHTML = ''; // Clear existing list

  poles.forEach(pole => {
    const listItem = document.createElement('li');
    listItem.dataset.poleid = pole.poleId;
    listItem.innerHTML = `
      <span class="pole-id">Pole ID: ${pole.poleId}</span>
      <span class="pole-status" style="color: ${pole.status === 'active' ? 'green' : 'red'};">&bull;</span>
      <span class="location-icon" onclick="searchGeolocation('${pole.geolocation}')">&#128204;</span>
      <span class="updated" style="display: block;">Live: ${new Date(pole.updatedAt).toLocaleString()}</span>
    `;
    poleList.appendChild(listItem);
  });
}

function searchGeolocation(geolocation) {
  const [lat, lng] = geolocation.split(',').map(parseFloat);
  const mapsUrl = `https://maps.google.com?q=${lat},${lng}`;

  // Open the Google Maps URL in a new tab
  window.open(mapsUrl, '_blank');
}


function displayNotification(title, options) {
  if (!('Notification' in window)) {
    console.error('This browser does not support desktop notification');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, options);
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, options);
      }
    });
  }
}

// Function to toggle the system status
async function fetchSystemStatus() {
  try {
    const response = await fetch('/system/checksystem');
    const data = await response.json();
     // Log the current system status
    updateToggleButton(data.status); // Update the toggle button label based on the status
  } catch (err) {
    console.error('Error fetching system status:', err);
  }
}

// Function to update the toggle button label based on the system status
function updateToggleButton(status) {
  const toggleButton = document.getElementById('systemToggle');
  toggleButton.textContent = status === 'active' ? 'System Is On' : 'System Is Off';
  toggleButton.classList.toggle('system-on', status === 'active');
  toggleButton.classList.toggle('system-off', status === 'inactive');
}

// Function to toggle the system status
async function toggleSystem() {
  try {
    const response = await fetch('/system/checksystem');
    const data = await response.json();

    if (data.status === 'active') {
      await fetch('/system/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'inactive' })
      });
      updateToggleButton('inactive'); // Update the toggle button label directly
      console.log('System toggled to Off');
    } else if (data.status === 'inactive') {
      await fetch('/system/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'active' })
      });
      updateToggleButton('active'); // Update the toggle button label directly
      console.log('System toggled to On');
    }
  } catch (err) {
    console.error('Error toggling system:', err);
  }
}
