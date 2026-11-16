// =============================================================================
// Functionality for Rueda Libre Website
// =============================================================================

// Wait for the DOM content to be fully loaded before running script logic
document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. Age Range Slider Synchronizer (reservas.html)
    // =========================================================================
    // Select the range slider input element by its ID
    const rangeInput = document.getElementById('rangeEdad');
    // Select the text display element where the age value will appear
    const rangeOutput = document.getElementById('rangeValue');

    // Only proceed if both elements exist on the current page
    if (rangeInput && rangeOutput) {
        // Listen for input changes in real-time as the user slides the control
        rangeInput.addEventListener('input', function () {
            // Update the display text with the current slider value
            rangeOutput.textContent = this.value;
        });
    }

    // =========================================================================
    // 2. Rental Policies Alert Modal (reservas.html)
    // =========================================================================
    // Select the policies alert/modal container
    const alertBox = document.getElementById('politicasAlert');
    // Select the trigger button that opens the policies modal
    const openBtn = document.getElementById('openAlertBtn');
    // Select the close button inside the policies modal
    const closeBtn = document.getElementById('closeAlertBtn');

    // Define a reusable function to smoothly hide the alert modal
    const hideAlert = () => {
        // Verify alert box exists and is currently visible (does not have 'd-none')
        if (alertBox && !alertBox.classList.contains('d-none')) {
            // Remove 'show' class to start the CSS fade-out animation
            alertBox.classList.remove('show');
            // Wait 150ms for Bootstrap's fade transition to finish
            setTimeout(() => {
                // Add 'd-none' class to completely hide it from the layout
                alertBox.classList.add('d-none');
            }, 150);
        }
    };

    // Check if both the alert modal and the open button exist
    if (alertBox && openBtn) {
        // Add click event listener to the open button
        openBtn.addEventListener('click', (e) => {
            // Prevent default anchor tag jump or link behavior
            e.preventDefault();
            // Remove 'd-none' so the modal element enters the document layout
            alertBox.classList.remove('d-none');
            // Brief timeout (10ms) to ensure DOM registers display change before fading
            setTimeout(() => {
                // Add 'show' class to trigger the smooth CSS fade-in
                alertBox.classList.add('show');
            }, 10);
        });
    }

    // Check if both the alert modal and the close button exist
    if (alertBox && closeBtn) {
        // Attach the hideAlert function when clicking the close button
        closeBtn.addEventListener('click', hideAlert);
    }

    // Listen for key presses anywhere in the document
    document.addEventListener('keydown', (e) => {
        // Check if the user pressed the 'Escape' key
        if (e.key === 'Escape') {
            // Close the alert modal if open
            hideAlert();
        }
    });

    // Listen for click events anywhere in the document to detect outside clicks
    document.addEventListener('click', (e) => {
        // Check if the alert box exists and is currently visible
        if (alertBox && !alertBox.classList.contains('d-none')) {
            // Close if click is outside the alert box and outside the open button
            if (!alertBox.contains(e.target) && openBtn && !openBtn.contains(e.target)) {
                // Close the alert modal
                hideAlert();
            }
        }
    });

    // =========================================================================
    // 3. Dynamic Minimum Reservation Date (reservas.html)
    // =========================================================================
    // Select the reservation date input field
    const fechaInput = document.getElementById('validationFecha');

    // Only configure date if the field exists on the current page
    if (fechaInput) {
        // Get the current local date and time
        const now = new Date();
        // Extract the full 4-digit year (e.g. 2026)
        const year = now.getFullYear();
        // Extract 1-based month and pad with a leading zero if under 10
        const month = String(now.getMonth() + 1).padStart(2, '0');
        // Extract day of the month and pad with a leading zero if under 10
        const day = String(now.getDate()).padStart(2, '0');
        // Construct date string formatted as YYYY-MM-DD
        const localToday = `${year}-${month}-${day}`;

        // If min date is not set or earlier than today, enforce today as minimum
        if (!fechaInput.min || fechaInput.min < localToday) {
            // Set the minimum allowed date to today, preventing past bookings
            fechaInput.min = localToday;
        }
    }

    // =========================================================================
    // 4. Form Validation & Submission Handling
    // =========================================================================
    // Select all forms that require custom Bootstrap validation
    const forms = document.querySelectorAll('.needs-validation');

    // Convert NodeList to an array and iterate through each form
    Array.from(forms).forEach(form => {
        // Listen for submit event on each form
        form.addEventListener('submit', event => {
            // Check if the form fails standard HTML5 validation constraints
            if (!form.checkValidity()) {
                // Prevent the form from submitting
                event.preventDefault();
                // Stop the event from bubbling up to parent elements
                event.stopPropagation();
            } else {
                // Prevent default browser form submission and page reload
                event.preventDefault();
                // Select the optional success message alert container
                const successMsg = document.getElementById('reservationSuccess');
                // Check if the success message element exists on the page
                if (successMsg) {
                    // Reveal success message by removing 'd-none' class
                    successMsg.classList.remove('d-none');
                    // Smoothly scroll the page so the user sees the confirmation
                    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    // Fallback browser alert dialog if no message element is found
                    alert('¡Reserva enviada con éxito! Nos pondremos en contacto contigo pronto.');
                }
                // Reset all form inputs back to their initial empty values
                form.reset();
                // Remove validation checkmarks and styling from the form
                form.classList.remove('was-validated');
                // Check if the age slider and its display label exist
                if (rangeInput && rangeOutput) {
                    // Reset the displayed age label to the default slider value
                    rangeOutput.textContent = rangeInput.value;
                }
                // Return early since the submission was successfully handled
                return;
            }
            // Add 'was-validated' class to trigger Bootstrap's visual validation styles
            form.classList.add('was-validated');
        }, false);
    });
});
