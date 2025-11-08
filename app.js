document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('mortgage-form');
    const resultsSection = document.querySelector('.results-section');
    const clearAllBtn = document.querySelector('.clear-all-btn');

    const amountInput = document.getElementById('mortgage-amount');
    const termInput = document.getElementById('mortgage-term');
    const rateInput = document.getElementById('interest-rate');

    const emptyResultsTemplate = `
        <div class="empty-results">
            <img src="./assets/images/illustration-empty.svg" alt="Empty illustration">
            <h2>Results shown here</h2>
            <p>Complete the form and click “calculate repayments” to see what your monthly repayments would be.</p>
        </div>
    `;

    const completedResultsTemplate = (monthlyRepayment, totalRepayment) => `
        <div class="completed-results">
            <h2>Your results</h2>
            <p>Your results are shown below based on the information you provided. To adjust the results, edit the form and click “calculate repayments” again.</p>
            <div class="results-content">
                <div class="result-item">
                    <p>Your monthly repayments</p>
                    <span class="value">£${monthlyRepayment}</span>
                </div>
                <div class="result-item">
                    <p>Total you'll repay over the term</p>
                    <span class="value">£${totalRepayment}</span>
                </div>
            </div>
        </div>
    `;

    const interestOnlyResultsTemplate = (monthlyRepayment, totalRepayment) => `
        <div class="completed-results">
            <h2>Your results</h2>
            <p>Your results are shown below based on the information you provided. To adjust the results, edit the form and click “calculate repayments” again.</p>
            <div class="results-content">
                <div class="result-item">
                    <p>Your monthly repayments</p>
                    <span class="value">£${monthlyRepayment}</span>
                </div>
                 <div class="result-item">
                    <p>Total you'll repay over the term</p>
                    <span class="value">£${totalRepayment}</span>
                </div>
            </div>
        </div>
    `;

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const showEmptyResults = () => {
        resultsSection.innerHTML = emptyResultsTemplate;
    };

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

    const validateRadio = () => {
        const type = document.querySelector('input[name="mortgage-type"]:checked');
        const errorEl = document.querySelector('.error-message[data-for="mortgage-type"]');
        if (!type) {
            errorEl.classList.add('show');
            return false;
        } else {
            errorEl.classList.remove('show');
            return true;
        }
    };

    const performCalculation = () => {
        const isAmountValid = validateField(amountInput);
        const isTermValid = validateField(termInput);
        const isRateValid = validateField(rateInput);
        const isTypeValid = validateRadio();
    
        if (!isAmountValid || !isTermValid || !isRateValid || !isTypeValid) {
            return;
        }
    
        const amount = parseFloat(amountInput.value.replace(/,/g, ''));
        const term = parseInt(termInput.value, 10);
        const rate = parseFloat(rateInput.value) / 100;
        const type = document.querySelector('input[name="mortgage-type"]:checked').value;
    
        let monthlyRepayment = 0;
        let totalRepayment = 0;
    
        if (type === 'repayment') {
            const monthlyRate = rate / 12;
            const numberOfPayments = term * 12;
            monthlyRepayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
            totalRepayment = monthlyRepayment * numberOfPayments;
            resultsSection.innerHTML = completedResultsTemplate(formatNumber(monthlyRepayment.toFixed(2)), formatNumber(totalRepayment.toFixed(2)));
        } else { // 'interest-only'
            monthlyRepayment = (amount * rate) / 12;
            totalRepayment = (monthlyRepayment * term * 12) + amount;
            resultsSection.innerHTML = interestOnlyResultsTemplate(formatNumber(monthlyRepayment.toFixed(2)), formatNumber(totalRepayment.toFixed(2)));
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        performCalculation();
    };

    const clearForm = () => {
        form.reset();
        showEmptyResults();
        document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
        document.querySelectorAll('.input-wrapper.error').forEach(el => el.classList.remove('error'));
    };

    const addCommasToInput = (e) => {
        let value = e.target.value.replace(/,/g, '');
        if (!isNaN(value) && value.length > 0) {
            e.target.value = formatNumber(value);
        }
    };

    const sanitizeDecimalInput = (e) => {
        let value = e.target.value;
        // Remove anything that's not a digit or a dot
        value = value.replace(/[^0-9.]/g, '');
        // Ensure there's only one dot
        const dotIndex = value.indexOf('.');
        if (dotIndex !== -1) {
            value = value.substring(0, dotIndex + 1) + value.substring(dotIndex + 1).replace(/\./g, '');
        }
        e.target.value = value;
    };

    const sanitizeIntegerInput = (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    };

    // Event Listeners
    form.addEventListener('submit', handleFormSubmit);
    clearAllBtn.addEventListener('click', clearForm);

    amountInput.addEventListener('blur', addCommasToInput);
    amountInput.addEventListener('focus', (e) => {
        e.target.value = e.target.value.replace(/,/g, ''); // Commas are for display only
    });

    [amountInput, termInput, rateInput].forEach(input => {
        input.addEventListener('input', (e) => {
            if (input.id === 'mortgage-term') {
                sanitizeIntegerInput(e);
            } else {
                sanitizeDecimalInput(e);
            }
            validateField(input);
        });
    });

    document.querySelectorAll('.radio-group').forEach(group => {
        group.addEventListener('click', () => {
            group.querySelector('input[type="radio"]').click();
        });
    });

    document.querySelectorAll('input[name="mortgage-type"]').forEach(radio => {
        radio.addEventListener('change', () => {
            validateRadio();
            // If results are already displayed, recalculate automatically
            if (resultsSection.querySelector('.completed-results')) {
                performCalculation();
            }
        });
    });

    // Initial state
    showEmptyResults();
});