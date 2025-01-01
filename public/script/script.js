// Common Elements
const sections = document.querySelectorAll('.section');
const successAlert = document.getElementById('success-alert');

// Navigate between sections
function navigateTo(sectionId) {
    sections.forEach((section) => {
        section.classList.remove('active');
    });
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) selectedSection.classList.add('active');
}

// Navigate to an external page
function navigateToPage(url) {
    window.location.href = url;
}

// Handle navigation with validation
function navigateWithValidation(form, targetPage) {
    if (form?.checkValidity()) {
        navigateToPage(targetPage);
    } else {
        form?.reportValidity();
    }
}

// Checkbox and button interaction
function handleCheckboxInteraction(checkboxId, buttonId, targetPage) {
    const checkbox = document.getElementById(checkboxId);
    const button = document.getElementById(buttonId);

    if (checkbox && button) {
        button.disabled = !checkbox.checked;

        checkbox.addEventListener('change', () => {
            button.disabled = !checkbox.checked;
        });

        button.addEventListener('click', () => {
            if (checkbox.checked) {
                navigateToPage(targetPage);
            } else {
                alert('Please accept the Terms & Conditions before proceeding.');
            }
        });
    }
}

// Form Submission Handlers
function handleBookingFormSubmission() {
    document.getElementById('booking-details-form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const state = document.getElementById('state').value;
        const wheelerRegNo = document.getElementById('wh_r_no').value;
        const chassisNo = document.getElementById('chassis_no').value;
        const engineNo = document.getElementById('eng_no').value;
        localStorage.setItem('wheelerRegNo', wheelerRegNo);
        // document.getElementById('result_state').textContent = state;
        // document.getElementById('result_wh_r_no').textContent = wheelerRegNo;
        // document.getElementById('result_chassis_no').textContent = chassisNo;
        // document.getElementById('result_eng_no').textContent = engineNo;

        saveBookingDetails(state, wheelerRegNo, chassisNo, engineNo);
    });
}

function handleUserFormSubmission() {
    document.getElementById('user-details-form')?.addEventListener('submit', (event) => {
        event.preventDefault();
    
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const  wheelerRegNo = localStorage.getItem('wheelerRegNo'); 

        // document.getElementById('result_name').textContent = name;
        // document.getElementById('result_email').textContent = email;
        // document.getElementById('result_phone').textContent = phone;
        // document.getElementById('result_address').textContent = address;
       console.log("handleUserFormSubmission");
       
  
       
        saveUserDetails( wheelerRegNo,name, email, phone, address);
    });
}

// Post Booking Details
function saveBookingDetails(state, wheelerRegNo, chassisNo, engineNo) {
    fetch('/api/booking-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state, wheeler_reg_no: wheelerRegNo, chassis_no: chassisNo, engine_no: engineNo }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('Booking details saved:', data);
       
        // const bookingId = data.bookingId;
        // saveUserDetails(bookingId); // Save user details next
    })
    .catch((error) => {
        console.error('Error saving booking details:', error);
        alert('Failed to save booking details. Please try again.');
    });
}

// Post User Details
function saveUserDetails( wheelerRegNo, name, email, phone, address) {
    fetch('/api/user-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wheeler_reg:  wheelerRegNo, name, email, phone, address }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('User details saved:', data);
        alert('Data saved successfully!');
    })
    .catch((error) => {
        console.error('Error saving user details:', error);
        alert('Failed to save user details. Please try again.');
    });
}



//admin 
// script.js


// Initialize Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Booking Form Navigation
    document.getElementById('to-user')?.addEventListener('click', () => {
        navigateWithValidation(document.getElementById('booking-details-form'), '/user-form.html');
    });
    
    document.getElementById('back-home')?.addEventListener('click', () => {
        navigateWithValidation(document.getElementById('booking-details-form'), '/index.html');
    });
    
    document.getElementById('back-booking')?.addEventListener('click', () => {
        navigateWithValidation(document.getElementById('user-details-form'), '/booking-form.html');
    });
    
    document.getElementById('to-entered_details')?.addEventListener('click', () => {
        navigateWithValidation(document.getElementById('user-details-form'), '/entered-form.html');
    });
    

    // Payment Navigation
    handleCheckboxInteraction('accept-terms', 'to-payment', '/payment-form.html');
    handleCheckboxInteraction('accept-terms', 'pay-later-to-home', '/index.html');

    document.getElementById('to-home')?.addEventListener('click', () => {
        if (document.getElementById('payment-details-form')?.checkValidity()) {
            successAlert.style.display = 'block';
            setTimeout(() => {
                successAlert.style.display = 'none';
                alert('Payment successful! Returning to the home page.');
                navigateToPage('/index.html');
            }, 2000);
        } else {
            document.getElementById('payment-details-form')?.reportValidity();
        }
    });

    // Form Submission Handlers
    handleBookingFormSubmission();
    handleUserFormSubmission();
});





//get by id


document.addEventListener("DOMContentLoaded", () => {
    // Check if the current page is 'entered-form.html'
    if (window.location.pathname === "/entered-form.html") {
        init(); // Call the function to initialize the page
    }

    // Main function to initialize the page
    function init() {
        // Retrieve wheeler_reg_no from local storage
        const wheelerRegNo = localStorage.getItem("wheelerRegNo");
        if (wheelerRegNo) {
            fetchDataByWheelerRegNo(wheelerRegNo);
        } else {
            alert("No Wheeler Registration Number found. Redirecting to the home page.");
            // Uncomment the line below to enable redirection
            // window.location.href = "../index.html"; // Redirect to home if missing
        }
    }

    // Function to fetch data by wheeler_reg_no
    async function fetchDataByWheelerRegNo(wheelerRegNo) {
        try {
            const response = await fetch(`/api/details/${encodeURIComponent(wheelerRegNo)}`);
            if (!response.ok) {
                throw new Error("Failed to fetch details");
            }
            const data = await response.json();
            updateDetailsOnPage(data);
        } catch (error) {
            console.error("Error fetching details:", error);
            alert("Error retrieving details. Please try again.");
        }
    }

    // Function to update details dynamically on the page
    function updateDetailsOnPage(data) {
        if (data) {
            document.getElementById("result_state").textContent = data.state || "N/A";
            document.getElementById("result_wh_rg_no").textContent = data.wheeler_reg_no || "N/A";
            document.getElementById("result_chassis_no").textContent = data.chassis_no || "N/A";
            document.getElementById("result_eng_no").textContent = data.engine_no || "N/A";
            document.getElementById("result_name").textContent = data.name || "N/A";
            document.getElementById("result_email").textContent = data.email || "N/A";
            document.getElementById("result_phone").textContent = data.phone || "N/A";
            document.getElementById("result_address").textContent = data.address || "N/A";
        } else {
            alert("No details found for the provided Wheeler Registration Number.");
        }
    }
});