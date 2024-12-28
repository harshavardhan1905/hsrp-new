const sections = document.querySelectorAll('.section');
const userDetailsForm = document.getElementById('user-details-form');
const bookingDetailsForm = document.getElementById('booking-details-form');
const paymentDetailsForm = document.getElementById('payment-details-form');
const successAlert = document.getElementById('success-alert');

// Navigate between sections
function navigateTo(sectionId) {
    sections.forEach((section) => {
        section.classList.remove('active');
    });

    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
}

// Navigate to an external page
function navigateToPage(url) {
    window.location.href = url;
}

// Add event listeners for navigation
document.getElementById('to-user')?.addEventListener('click', () => {
    if (bookingDetailsForm?.checkValidity()) {
        window.location.href = '/forms/user-form.html';
    } else {
        bookingDetailsForm?.reportValidity();
    }
});
document.getElementById('back-home')?.addEventListener('click', () =>{
    if(bookingDetailsForm?.checkValidity()){
        window.location.href ='../index.html';
    }
    else{
        bookingDetailsForm?.reportValidity();
    }
});

//back to booking page
document.getElementById('back-booking')?.addEventListener('click', () => {
    if(userDetailsForm?.checkValidity()){
        window.location.href = 'booking-form.html';
    }
    else{
        userDetailsForm?.reportValidity();
    }
});
document.getElementById('to-entered_details')?.addEventListener('click', () => {
    if (userDetailsForm?.checkValidity()) {
        // Navigate to home.html (which is in the root directory)
        window.location.href = 'entered-form.html'; // Go up one directory and access home.html
    } else {
        userDetailsForm?.reportValidity();
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('accept-terms');
    const confirmButton = document.getElementById('to-payment');

    if (checkbox && confirmButton) {
        confirmButton.disabled = !checkbox.checked;

        checkbox.addEventListener('change', () => {
            confirmButton.disabled = !checkbox.checked;
        });

        confirmButton.addEventListener('click', () => {
            if (checkbox.checked) {
                window.location.href = '/forms/payment-form.html';
            } else {
                alert('Please accept the Terms & Conditions before proceeding.');
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('accept-terms');
    const confirmButton = document.getElementById('pay-later-to-home');

    if (checkbox && confirmButton) {
        confirmButton.disabled = !checkbox.checked;

        checkbox.addEventListener('change', () => {
            confirmButton.disabled = !checkbox.checked;
        });

        confirmButton.addEventListener('click', () => {
            if (checkbox.checked) {
                window.location.href = '/index.html';
            } else {
                alert('Please accept the Terms & Conditions before proceeding.');
            }
        });
    }
});

document.getElementById('to-home')?.addEventListener('click', () => {
    if (paymentDetailsForm?.checkValidity()) {
        successAlert.style.display = 'block';
        setTimeout(() => {
            successAlert.style.display = 'none';
            alert('Payment successful! Returning to the home page.');
            navigateToPage('/index.html');
        }, 2000);
    } else {
        paymentDetailsForm?.reportValidity();
    }
});

// Add navigation links' event listeners
document.querySelectorAll('nav a').forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('href').substring(1);
        navigateTo(targetSection);
    });
});

// Handle booking details form submission
document.getElementById('booking-details-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get values from booking details form
    const state = document.getElementById('state').value;
    const wh_r_no = document.getElementById('wh_r_no').value;
    const chassis_no = document.getElementById('chassis_no').value;
    const eng_no = document.getElementById('eng_no').value;

    // Display booking details in the result section
    document.getElementById('result_state').textContent = state;
    document.getElementById('result_wh_r_no').textContent = wh_r_no;
    document.getElementById('result_chassis_no').textContent = chassis_no;
    document.getElementById('result_eng_no').textContent = eng_no;
});

// Handle user details form submission
document.getElementById('user-details-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get values from user details form
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    // Display user details in the result section
    document.getElementById('result_name').textContent = name;
    document.getElementById('result_email').textContent = email;
    document.getElementById('result_phone').textContent = phone;
    document.getElementById('result_address').textContent = address;
});

