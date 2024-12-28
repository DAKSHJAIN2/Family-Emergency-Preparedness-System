const disasterChecklists = {
    earthquake: [
        "Drop, Cover, and Hold On.",
        "Stay indoors until the shaking stops.",
        "Check for injuries and provide first aid if necessary.",
        "Prepare for aftershocks.",
        "Secure heavy furniture and appliances.",
        "Create an emergency communication plan.",
        "Practice earthquake drills regularly."
    ],
    fire: [
        "Evacuate immediately.",
        "Call 911 once you are safe.",
        "Use stairs, not elevators.",
        "Stay low to avoid smoke inhalation.",
        "Install smoke detectors and check them monthly.",
        "Create a fire escape plan and practice it.",
        "Keep a fire extinguisher accessible."
    ],
    flood: [
        "Move to higher ground.",
        "Avoid walking or driving through flood waters.",
        "Stay informed about weather updates.",
        "Prepare an emergency kit.",
        "Know your evacuation routes.",
        "Secure important documents in a waterproof container.",
        "Install sump pumps in basements."
    ],
    hurricane: [
        "Evacuate if instructed to do so.",
        "Secure your home and property.",
        "Stock up on supplies.",
        "Stay tuned to local news for updates.",
        "Create a family emergency plan.",
        "Have a battery-powered radio for updates.",
        "Prepare a disaster supply kit."
    ],
    tornado: [
        "Seek shelter in a sturdy building or designated storm shelter.",
        "Avoid windows and doors.",
        "Cover your head and neck with your arms.",
        "Have a weather radio to receive alerts.",
        "Create a family communication plan.",
        "Practice tornado drills with your family."
    ],
    winter_storm: [
        "Stay indoors and avoid travel if possible.",
        "Keep extra blankets and warm clothing available.",
        "Have a supply of food and water.",
        "Check on neighbors, especially the elderly.",
        "Prepare your vehicle for winter conditions.",
        "Have a battery-powered radio for updates."
    ]
};

const medicalChecklists = {
    first_aid: [
        "Assess the situation.",
        "Call for help if needed.",
        "Perform CPR if necessary.",
        "Control bleeding with direct pressure.",
        "Use a tourniquet if bleeding is severe.",
        "Treat for shock.",
        "Keep the person calm and comfortable.",
        "Check for any medical ID or allergies.",
        "Do not give food or drink to an unconscious person."
    ],
    choking: [
        "Encourage the person to cough.",
        "Perform the Heimlich maneuver if they cannot cough.",
        "Call 911 if the person becomes unconscious.",
        "Begin CPR if necessary.",
        "If the person is pregnant or obese, use chest thrusts instead."
    ],
    bleeding: [
        "Apply direct pressure to the wound.",
        "Elevate the injury if possible.",
        "Use a clean cloth or bandage to cover the wound.",
        "Seek medical help if bleeding does not stop.",
        "If bleeding is severe, apply a tourniquet above the wound."
    ],
    burns: [
        "Cool the burn under running water for at least 10 minutes.",
        "Cover the burn with a sterile, non-stick bandage.",
        "Do not apply ice directly to the burn.",
        "Seek medical attention for severe burns.",
        "Do not pop blisters."
    ],
    fractures: [
        "Do not move the person unless necessary.",
        "Immobilize the injured area.",
        "Apply ice to reduce swelling.",
        "Seek medical help for fractures.",
        "Check for circulation below the injury."
    ],
    allergic_reaction: [
        "Identify the allergen and remove it if possible.",
        "Administer antihistamines if available.",
        "Use an EpiPen if the person is experiencing anaphylaxis.",
        "Call 911 for severe reactions.",
        "Monitor the person for difficulty breathing."
    ]
};

// Preparation times in seconds
const preparationTimes = {
    earthquake: 300, // 5 minutes
    fire: 180, // 3 minutes
    flood: 300, // 5 minutes
    hurricane: 7200, // 2 hours
    tornado: 300, // 5 minutes
    winter_storm: 3600, // 1 hour
    first_aid: 600, // 10 minutes
    choking: 180, // 3 minutes
    bleeding: 300, // 5 minutes
    burns: 600, // 10 minutes
    fractures: 600, // 10 minutes
    allergic_reaction: 300 // 5 minutes
};

let countdownTimer;
let timeLeft;
let currentDisaster = null; // Track the currently selected disaster
let currentMedical = null; // Track the currently selected medical emergency

function toggleDropdown(dropdownId) {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    dropdowns.forEach(dropdown => {
        if (dropdown.id !== dropdownId) {
            dropdown.classList.remove('show'); // Collapse other dropdowns
        }
    });

    const dropdown = document.getElementById(dropdownId);
    dropdown.classList.toggle('show'); // Toggle the selected dropdown
}

function toggleChecklist(disaster) {
    const checklist = document.getElementById('checklist');
    if (currentDisaster === disaster) {
        checklist.style.display = 'none'; // Hide if already open
        currentDisaster = null; // Reset current disaster
    } else {
        showChecklist(disaster); // Show the checklist for the selected disaster
    }
}

function toggleMedicalChecklist(medical) {
    const medicalChecklist = document.getElementById('medical-checklist');
    if (currentMedical === medical) {
        medicalChecklist.style.display = 'none'; // Hide if already open
        currentMedical = null; // Reset current medical
    } else {
        showMedicalChecklist(medical); // Show the checklist for the selected medical emergency
    }
}

function showChecklist(disaster) {
    const checklistItems = document.getElementById('checklist-items');
    checklistItems.innerHTML = ''; // Clear previous items
    disasterChecklists[disaster].forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox" onchange="updateSelectedItems(this, '${item}')"> ${item}`;
        checklistItems.appendChild(li);
    });
    document.getElementById('checklist').style.display = 'block'; // Show checklist

    // Hide other medical emergencies if a disaster is selected
    if (currentMedical) {
        document.getElementById('medical-checklist').style.display = 'none';
        currentMedical = null; // Reset current medical
    }

    // Start the countdown timer for the selected disaster
    startCountdown(disaster);
    currentDisaster = disaster; // Set the current disaster
}

function showMedicalChecklist(medical) {
    const medicalChecklistItems = document.getElementById('medical-checklist-items');
    medicalChecklistItems.innerHTML = ''; // Clear previous items
    medicalChecklists[medical].forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox" onchange="updateSelectedMedicalItems(this, '${item}')"> ${item}`;
        medicalChecklistItems.appendChild(li);
    });
    document.getElementById('medical-checklist').style.display = 'block'; // Show medical checklist

    // Hide other disasters if a medical emergency is selected
    if (currentDisaster) {
        document.getElementById('checklist').style.display = 'none';
        currentDisaster = null; // Reset current disaster
    }

    // Start the countdown timer for the selected medical emergency
    startMedicalCountdown(medical);
    currentMedical = medical; // Set the current medical emergency
}

function startCountdown(disaster) {
    // Clear any existing timer
    clearInterval(countdownTimer);

    // Set the time left based on the preparation time for the selected disaster
    timeLeft = preparationTimes[disaster];

    // Update the alert message with the initial time
    updateAlertMessage(timeLeft);

    // Start the countdown
    countdownTimer = setInterval(() => {
        timeLeft--;
        updateAlertMessage(timeLeft);

        // If time runs out, stop the timer and alert the user
        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            alert("Time is up! Please take action immediately.");
            document.getElementById('alert-message').innerText = ""; // Clear alert message
        }
    }, 1000); // Update every second
}

function startMedicalCountdown(medical) {
    // Clear any existing timer
    clearInterval(countdownTimer);

    // Set the time left based on the preparation time for the selected medical emergency
    timeLeft = preparationTimes[medical];

    // Update the alert message with the initial time
    updateAlertMessage(timeLeft);

    // Start the countdown
    countdownTimer = setInterval(() => {
        timeLeft--;
        updateAlertMessage(timeLeft);

        // If time runs out, stop the timer and alert the user
        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            alert("Time is up! Please take action immediately.");
            document.getElementById('alert-message').innerText = ""; // Clear alert message
        }
    }, 1000); // Update every second
}

function updateAlertMessage(time) {
    const alertMessage = document.getElementById('alert-message');
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    alertMessage.innerHTML = `Time left: <span style="color: red; font-weight: bold; font-size: 32px;">${minutes}:${seconds < 10 ? '0' : ''}${seconds}</span>`;
}

const selectedItems = [];

function updateSelectedItems(checkbox, item) {
    if (checkbox.checked) {
        selectedItems.push(item);
    } else {
        const index = selectedItems.indexOf(item);
        if (index > -1) {
            selectedItems.splice(index, 1);
        }
    }
}

function saveChecklist() {
    const checklistItems = document.getElementById('checklist-items');
    selectedItemsContainer = document.getElementById('selected-items');
    selectedItemsContainer.innerHTML = ''; // Clear previous selected items

    // Move selected items to the selected items list
    selectedItems.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `${item} <button onclick="removeSelectedItem('${item}')">Remove</button>`;
        selectedItemsContainer.appendChild(li);
    });

    // Remove selected items from the main checklist
    const allItems = checklistItems.querySelectorAll('li');
    allItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            item.remove();
        }
    });

    // Clear the selected items array
    selectedItems.length = 0; // Reset the selected items array
}

function removeSelectedItem(item) {
    // Remove the item from the selected items list
    const selectedItemsContainer = document.getElementById('selected-items');
    const items = selectedItemsContainer.querySelectorAll('li');
    items.forEach(li => {
        if (li.textContent.includes(item)) {
            li.remove(); // Remove from selected items display
        }
    });

    // Add the item back to the selectedItems array
    const index = selectedItems.indexOf(item);
    if (index > -1) {
        selectedItems.splice(index, 1);
    }

    // Add the item back to the main checklist
    const checklistItems = document.getElementById('checklist-items');
    const li = document.createElement('li');
    li.innerHTML = `<input type="checkbox" onchange="updateSelectedItems(this, '${item}')"> ${item}`;
    checklistItems.appendChild(li);
}

// Medical checklist functions
const selectedMedicalItems = [];

function updateSelectedMedicalItems(checkbox, item) {
    if (checkbox.checked) {
        selectedMedicalItems.push(item);
    } else {
        const index = selectedMedicalItems.indexOf(item);
        if (index > -1) {
            selectedMedicalItems.splice(index, 1);
        }
    }
}

function saveMedicalChecklist() {
    const medicalChecklistItems = document.getElementById('medical-checklist-items');
    const selectedMedicalItemsContainer = document.getElementById('selected-medical-items');
    selectedMedicalItemsContainer.innerHTML = ''; // Clear previous selected medical items

    // Move selected medical items to the selected items list
    selectedMedicalItems.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `${item} <button onclick="removeSelectedMedicalItem('${item}')">Remove</button>`;
        selectedMedicalItemsContainer.appendChild(li);
    });

    // Remove selected medical items from the main checklist
    const allMedicalItems = medicalChecklistItems.querySelectorAll('li');
    allMedicalItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            item.remove();
        }
    });

    // Clear the selected medical items array
    selectedMedicalItems.length = 0; // Reset the selected medical items array
}

function removeSelectedMedicalItem(item) {
    // Remove the item from the selected medical items list
    const selectedMedicalItemsContainer = document.getElementById('selected-medical-items');
    const items = selectedMedicalItemsContainer.querySelectorAll('li');
    items.forEach(li => {
        if (li.textContent.includes(item)) {
            li.remove(); // Remove from selected medical items display
        }
    });

    // Add the item back to the selectedMedicalItems array
    const index = selectedMedicalItems.indexOf(item);
    if (index > -1) {
        selectedMedicalItems.splice(index, 1);
    }

    // Add the item back to the main medical checklist
    const medicalChecklistItems = document.getElementById('medical-checklist-items');
    const li = document.createElement('li');
    li.innerHTML = `<input type="checkbox" onchange="updateSelectedMedicalItems(this, '${item}')"> ${item}`;
    medicalChecklistItems.appendChild(li);
}

// Function to send alert
function sendAlert() {
    const alertMessage = "This is a test alert! Stay safe and follow your emergency plan.";
    document.getElementById('alert-message').innerText = alertMessage;

    // Simulate push notification (in a real app, this would be handled by a service)
    alert('Push Notification: ' + alertMessage);
}

// Load saved checklist on page load
window.onload = function() {
    const savedItems = JSON.parse(localStorage.getItem('emergencyChecklist'));
    if (savedItems) {
        const checklistItems = document.querySelectorAll('#checklist-items input[type="checkbox"]');
        checklistItems.forEach((item, index) => {
            item.checked = savedItems[index];
        });
    }
};

// Function to toggle visibility of other emergencies
function toggleEmergencySection(selectedSection) {
    const disasterContainer = document.getElementById('disasterDropdown');
    const medicalContainer = document.getElementById('medicalDropdown');

    if (selectedSection === 'disaster') {
        if (currentDisaster) {
            disasterContainer.classList.remove('show'); // Collapse if already selected
            currentDisaster = null;
        } else {
            medicalContainer.classList.remove('show'); // Hide medical emergencies
            currentDisaster = selectedSection; // Set current disaster
        }
    } else if (selectedSection === 'medical') {
        if (currentMedical) {
            medicalContainer.classList.remove('show'); // Collapse if already selected
            currentMedical = null;
        } else {
            disasterContainer.classList.remove('show'); // Hide disaster emergencies
            currentMedical = selectedSection; // Set current medical
        }
    }
}