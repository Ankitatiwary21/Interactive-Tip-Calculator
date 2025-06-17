// script.js

// ========================================
//            DOM Element Selections
// ========================================
// Get references to all necessary HTML elements from the DOM.
// These will be used to read input values and update the display.

const billInput = document.getElementById('bill-input');
const tipButtons = document.querySelectorAll('.tip-percent-btn'); // Selects all predefined tip buttons
const customTipInput = document.getElementById('custom-tip-input');
const peopleInput = document.getElementById('people-input');
const tipAmountDisplay = document.getElementById('tip-amount-display');
const totalAmountDisplay = document.getElementById('total-amount-display');
const resetButton = document.getElementById('reset-button');
const form = document.getElementById('tip-form'); // Assuming you wrapped inputs in a form

// (You might have more specific element selections for error messages or input groups)
// const peopleErrorMsg = document.getElementById('people-error');

// ========================================
//                 Global Variables
// ========================================
// Store the currently selected tip percentage.
// Initialize to 0 or a default value.
let currentTipPercentage = 0;

// ========================================
//               Event Listeners
// ========================================
// Attach event listeners to input fields and buttons
// to trigger calculations or actions when the user interacts with them.

billInput.addEventListener('input', handleInputChange);
customTipInput.addEventListener('input', handleCustomTipChange);
peopleInput.addEventListener('input', handleInputChange);

tipButtons.forEach(button => {
    button.addEventListener('click', handleTipButtonClick);
});

resetButton.addEventListener('click', resetCalculator);

// Generic handler for inputs that directly trigger a calculation
function handleInputChange() {
    // Any immediate validation or feedback specific to this input can go here
    // For example, showing an error if peopleInput.value <= 0
    // Then, call the main calculation function.
    calculateTip();
}

/**
 * Handles clicks on predefined tip percentage buttons.
 * Updates the currentTipPercentage and the visual state of buttons.
 * @param {Event} event - The click event object.
 */
function handleTipButtonClick(event) {
    // Remove 'active' class from all tip buttons
    tipButtons.forEach(btn => btn.classList.remove('active-tip'));
    
    // Add 'active' class to the clicked button
    event.target.classList.add('active-tip');
    
    // Update currentTipPercentage from the button's data attribute
    // parseFloat is used as data attributes are strings.
    currentTipPercentage = parseFloat(event.target.dataset.tip);
    
    // Clear custom tip input as a predefined tip is now selected
    customTipInput.value = ''; 
    
    // Recalculate
    calculateTip();
}

/**
 * Handles input changes in the custom tip percentage field.
 * Updates currentTipPercentage and deactivates predefined tip buttons.
 */
function handleCustomTipChange() {
    // When custom tip is used, remove 'active' state from predefined buttons
    tipButtons.forEach(btn => btn.classList.remove('active-tip'));
    
    const customTipValue = parseFloat(customTipInput.value);
    
    // Update currentTipPercentage, ensuring it's a valid number (not NaN)
    // If input is invalid or empty, treat tip as 0 for calculation purposes.
    currentTipPercentage = isNaN(customTipValue) || customTipValue < 0 ? 0 : customTipValue;
    
    // Recalculate
    calculateTip();
}

// ========================================
//          Core Calculation Logic
// ========================================

/**
 * Main function to calculate tip and total per person.
 * It reads all input values, performs validation checks,
 * calculates amounts, and updates the display.
 */
function calculateTip() {
    // Convert input values (strings) to numbers.
    // Use parseFloat to allow for decimal values in bill amount.
    const billAmount = parseFloat(billInput.value);
    const numberOfPeople = parseInt(peopleInput.value); // Number of people is usually an integer

    // --- Input Validation ---
    // Check for invalid inputs. If any are found, display $0.00 and possibly show errors.

    let isValid = true; // Flag to track overall input validity

    // Validate Bill Amount: Must be a positive number.
    if (isNaN(billAmount) || billAmount < 0) {
        // If bill is invalid, often we calculate as if bill is 0 or show error.
        // For this example, let's assume we proceed but results will be $0.00 if bill is NaN or <0.
        // Or, you might set isValid = false and updateUI to show $0.00 and return.
        // billInput.classList.add('error'); // Example error styling
    } else {
        // billInput.classList.remove('error');
    }

    // Validate Number of People: Must be a positive integer (greater than 0).
    // This is critical to avoid division by zero.
    if (isNaN(numberOfPeople) || numberOfPeople <= 0) {
        // If number of people is invalid (0, negative, or not a number),
        // display $0.00 and prevent further calculation to avoid errors.
        // Also, provide visual feedback to the user.
        updateDisplay(0, 0); // Display $0.00
        // peopleInput.classList.add('error'); // Example error styling
        // peopleErrorMsg.textContent = "Can't be zero or less"; // Show specific error
        return; // Exit the function early
    } else {
        // peopleInput.classList.remove('error');
        // peopleErrorMsg.textContent = ""; // Clear error
    }
    
    // Validate Tip Percentage: (currentTipPercentage is already handled in its event listeners)
    // We can add a check here if needed, ensuring it's not negative.
    if (currentTipPercentage < 0) {
        // This scenario should ideally be prevented by input handlers,
        // but defensive check can be useful.
        updateDisplay(0, 0);
        return;
    }

    // If any core input (bill, people) is not a valid number for calculation (e.g. bill is NaN)
    // then we should show 0.00 rather than NaN in results.
    if (isNaN(billAmount)) {
        updateDisplay(0,0);
        return;
    }

    // --- Perform Calculations ---
    // Calculate total tip amount
    const totalTip = billAmount * (currentTipPercentage / 100);

    // Calculate total bill including tip
    const totalBillWithTip = billAmount + totalTip;

    // Calculate tip amount per person
    const tipPerPerson = totalTip / numberOfPeople;

    // Calculate total amount per person
    const totalPerPerson = totalBillWithTip / numberOfPeople;

    // Update the UI with the calculated and formatted values.
    // The `toFixed(2)` method formats the number to two decimal places.
    updateDisplay(tipPerPerson, totalPerPerson);
}

// ========================================
//             DOM Update Function
// ========================================

/**
 * Updates the 'Tip Amount / person' and 'Total / person' display fields.
 * Formats the numbers to two decimal places.
 * @param {number} tipResult - The calculated tip amount per person.
 * @param {number} totalResult - The calculated total amount per person.
 */
function updateDisplay(tipResult, totalResult) {
    // Ensure results are not NaN or Infinity before displaying.
    // If they are, display $0.00 as a fallback.
    const safeTipResult = (isNaN(tipResult) || !isFinite(tipResult)) ? 0 : tipResult;
    const safeTotalResult = (isNaN(totalResult) || !isFinite(totalResult)) ? 0 : totalResult;

    tipAmountDisplay.textContent = `$${safeTipResult.toFixed(2)}`;
    totalAmountDisplay.textContent = `$${safeTotalResult.toFixed(2)}`;
}

// ========================================
//             Reset Functionality
// ========================================

/**
 * Resets the calculator to its initial state.
 * Clears all input fields, resets tip selection,
 * and clears the displayed results.
 */
function resetCalculator() {
    // Reset input field values
    billInput.value = ''; // Or '0' if you prefer a default
    customTipInput.value = '';
    peopleInput.value = ''; // Or '1' if that's your default

    // Reset the stored tip percentage
    currentTipPercentage = 0;

    // Deactivate any active tip percentage button
    tipButtons.forEach(button => {
        button.classList.remove('active-tip');
    });

    // Reset the displayed amounts to $0.00
    updateDisplay(0, 0);

    // Remove any validation error styling (if applicable)
    // billInput.classList.remove('error');
    // peopleInput.classList.remove('error');
    // peopleErrorMsg.textContent = "";
    
    // Optionally, set focus to the bill input for better UX after reset
    // billInput.focus(); 
}

// ========================================
//         Initial Setup / Call
// ========================================
// Perform any initial setup when the script loads.
// For example, you might want to display $0.00 initially.
updateDisplay(0, 0);