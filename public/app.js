/**
 * Основний файл скрипта додатку
 * Відповідає за взаємодію з користувачем та відображення результатів
 */
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.getElementById('togglePassword');
    const checkPasswordButton = document.getElementById('checkPassword');
    const resultContainer = document.getElementById('resultContainer');
    const strengthMeter = document.getElementById('strengthMeter');
    const strengthText = document.getElementById('strengthText');
    const checkResults = document.getElementById('checkResults');

    // Обробник кнопки показу/приховування пароля
    togglePasswordButton.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePasswordButton.textContent = '🔒';
        } else {
            passwordInput.type = 'password';
            togglePasswordButton.textContent = '👁️';
        }
    });

    // Обробник кнопки перевірки пароля
    checkPasswordButton.addEventListener('click', function() {
        const password = passwordInput.value;
        
        if (!password) {
            alert('Будь ласка, введіть пароль!');
            return;
        }
        
        // Валідація пароля з використанням модуля password-validator.js
        const result = validatePassword(password, variants.variant1, charSets);
        
        // Відображення результатів
        displayResults(result);
    });

    /**
     * Функція для відображення результатів перевірки
     * @param {Object} result - результат валідації пароля
     */
    function displayResults(result) {
        // Очистка попередніх результатів
        checkResults.innerHTML = '';
        
        // Відображення контейнера з результатами
        resultContainer.style.display = 'block';
        
        // Встановлення класу результатів залежно від валідності пароля
        if (result.isValid) {
            resultContainer.className = 'result success';
        } else {
            resultContainer.className = 'result error';
        }
        
        // Відображення шкали стійкості пароля
        const strength = result.passwordStrength;
        strengthMeter.style.width = strength.score + '%';
        strengthMeter.style.backgroundColor = strength.level.color;
        strengthText.textContent = `Стійкість пароля: ${strength.level.text} (${strength.score} з 100)`;
        strengthText.style.color = strength.level.color;
        
        // Відображення перевірки довжини
        const lengthCheckItem = document.createElement('div');
        lengthCheckItem.className = 'check-item';
        lengthCheckItem.innerHTML = `
            <span class="check-icon ${result.lengthCheck.valid ? 'valid' : 'invalid'}">
                ${result.lengthCheck.valid ? '✓' : '✗'}
            </span>
            ${result.lengthCheck.message}
        `;
        checkResults.appendChild(lengthCheckItem);
        
        // Відображення перевірки наборів символів
        for (const setCheck of result.setChecks) {
            const setCheckItem = document.createElement('div');
            setCheckItem.className = 'check-item';
            setCheckItem.innerHTML = `
                <span class="check-icon ${setCheck.valid ? 'valid' : 'invalid'}">
                    ${setCheck.valid ? '✓' : '✗'}
                </span>
                ${setCheck.message}
            `;
            checkResults.appendChild(setCheckItem);
        }
        
        // Відображення перевірки кількості використаних наборів
        const setsUsedCheckItem = document.createElement('div');
        setsUsedCheckItem.className = 'check-item';
        setsUsedCheckItem.innerHTML = `
            <span class="check-icon ${result.setsUsedCheck.valid ? 'valid' : 'invalid'}">
                ${result.setsUsedCheck.valid ? '✓' : '✗'}
            </span>
            ${result.setsUsedCheck.message}
        `;
        checkResults.appendChild(setsUsedCheckItem);
    }
});