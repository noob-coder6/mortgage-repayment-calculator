# Frontend Mentor - Mortgage repayment calculator solution

This is a solution to the [Mortgage repayment calculator challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/mortgage-repayment-calculator-Galx1LXK73). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- Input mortgage information and see monthly repayment and total repayment amounts after submitting the form
- See form validation messages if any field is incomplete
- Complete the form only using their keyboard
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page


### Links

- Solution URL: [Solution URL](https://github.com/noob-coder6/mortgage-repayment-calculator.git)
- Live Site URL: [Live site URL](https://noob-coder6.github.io/mortgage-repayment-calculator/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- Mobile-first workflow
- Vanilla JavaScript
- Real-time form validation
- Input sanitization and formatting

### What I learned

Working on this project helped me understand several important concepts:

**Form Validation**: Implemented real-time validation that checks fields as users type, providing immediate feedback.

```js
const validateField = (input) => {
    const value = input.value.trim();
    const errorEl = document.querySelector(`.error-message[data-for="${input.id}"]`);
    const inputWrapper = input.closest('.input-wrapper');

    if (value === '') {
        errorEl.classList.add('show');
        inputWrapper.classList.add('error');
        return false;
    } else {
        errorEl.classList.remove('show');
        inputWrapper.classList.remove('error');
        return true;
    }
};
```

**Input Sanitization**: Learned how to restrict user input to only valid characters using regex and event handlers.

```js
const sanitizeDecimalInput = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.]/g, '');
    const dotIndex = value.indexOf('.');
    if (dotIndex !== -1) {
        value = value.substring(0, dotIndex + 1) + value.substring(dotIndex + 1).replace(/\./g, '');
    }
    e.target.value = value;
};
```

**Mortgage Calculations**: Implemented the standard mortgage repayment formula and interest-only calculations.

```js
// Repayment mortgage formula
const monthlyRate = rate / 12;
const numberOfPayments = term * 12;
monthlyRepayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
```

**Dynamic Content**: Used template literals to dynamically generate and inject HTML content based on calculation results.

```js
const completedResultsTemplate = (monthlyRepayment, totalRepayment) => `
    <div class="completed-results">
        <h2>Your results</h2>
        <p>Your results are shown below based on the information you provided.</p>
        <div class="result-item">
            <p>Your monthly repayments</p>
            <span class="value">£${monthlyRepayment}</span>
        </div>
    </div>
`;
```

### Continued development

Areas I want to focus on in future projects:

- **Accessibility**: Improve keyboard navigation and screen reader support with ARIA labels
- **Error handling**: Add more specific validation messages (e.g., minimum/maximum values)
- **Advanced calculations**: Include options for overpayments and different payment frequencies
- **Data persistence**: Save user inputs using localStorage so they persist across sessions
- **Testing**: Learn to write unit tests for validation and calculation functions

## Author

- Frontend Mentor - [@noob-coder6](https://www.frontendmentor.io/profile/noob-coder6)