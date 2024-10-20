const my_drone_id = 3001; //65010130 
const config_url = `http://127.0.0.1:8000/api/drone-config/${my_drone_id}`; 
const log_url = 'https://app-tracking.pockethost.io/api/collections/drone_logs/records';

const divConfig = document.getElementById("config");
const divStatus = document.getElementById("status");
const myForm = document.getElementById("my-form");
const logTableBody = document.querySelector("#logTable tbody");

let myConfig = {};

const getConfig = async (droneId) => {
    try {
        const response = await fetch(config_url);
        if (!response.ok) throw new Error("Failed to fetch config");

        const config = await response.json();
        myConfig = config;
        displayConfig(config);
    } catch (error) {
        console.error('Error:', error);
        divConfig.innerHTML = `<p>Error fetching config: ${error.message}</p>`;
    }
};

const displayConfig = (config) => {
    divConfig.innerHTML = `
        <ul>
            <li>Drone ID: ${config.drone_id}</li>
            <li>Drone Name: ${config.drone_name}</li>
            <li>Light: ${config.light}</li>
            <li>Max Speed: ${config.max_speed}</li>
            <li>Country: ${config.country}</li>
            <li>Population: ${config.population}</li>
        </ul>
    `;
};

const postLog = async (data) => {
    try {
        const response = await fetch(log_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Failed to submit log data.');

        const result = await response.json();
        divStatus.innerHTML = `<p>Log submitted successfully with ID: ${result.id}</p>`;
        await loadLogs(); 
    } catch (error) {
        divStatus.innerHTML = `<p>Error: ${error.message}</p>`;
    }
};

const loadLogs = async () => {
    try {
        const response = await fetch(log_url);
        if (!response.ok) throw new Error("Failed to fetch logs");

        const logs = await response.json();
        displayLogs(logs.items); 
    } catch (error) {
        console.error('Error fetching logs:', error);
        divStatus.innerHTML = `<p>Error fetching logs: ${error.message}</p>`;
    }
};

const displayLogs = (logs) => {
    logTableBody.innerHTML = logs.map(log => `
        <tr>
            <td>${new Date(log.created).toLocaleString()}</td>
            <td>${log.country}</td>
            <td>${log.drone_id}</td>
            <td>${log.drone_name}</td>
            <td>${log.celsius}</td>
        </tr>
    `).join('');
};

myForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const temperature = parseFloat(document.getElementById("temperature").value);
    if (isNaN(temperature)) {
        divStatus.innerHTML = `<p>Please enter a valid temperature.</p>`;
        return;
    }

    const logData = {
        drone_id: my_drone_id,
        drone_name: myConfig.drone_name,
        celsius: temperature,
        country: myConfig.country
    };

    divStatus.innerHTML = "<p>Submitting log...</p>";
    await postLog(logData);
});

const main = async () => {
    await getConfig(my_drone_id);
    await loadLogs(); 
};

main();
