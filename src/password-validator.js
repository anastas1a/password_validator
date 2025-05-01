// password-validator.js

document.addEventListener('DOMContentLoaded', function () {
    console.log('Password validator script loaded');
});

/**
 * Набори символів для перевірки
 */
const charSets = {
    lowercase: {
        regex: /[a-z]/,
        description: 'Латинські маленькі літери (a-z)'
    },
    digits: {
        regex: /\d/,
        description: 'Цифри (0-9)'
    },
    uppercase: {
        regex: /[A-Z]/,
        description: 'Латинські великі літери (A-Z)'
    },
    special: {
        regex: /[!@#$%^&*_\-+]/,
        description: 'Спеціальні символи (!@#$%^&*_-+)'
    }
};

/**
 * Варіанти перевірок паролів
 */
const variants = {
    variant1: {
        minLength: 8, // нова умова
        minSets: 2,
        requiredSets: ['lowercase', 'digits', 'uppercase', 'special']
    }
};

/**
 * Основна функція валідації пароля
 * @param {string} password - Пароль для перевірки
 * @param {Object} ruleSet - Об'єкт правил перевірки
 * @param {Object} charSets - Об'єкт із наборами символів
 * @returns {Object} Результат перевірки
 */
function validatePassword(password, ruleSet, charSets) {
    // Перевірка довжини
    const lengthCheck = {
        valid: password.length >= ruleSet.minLength,
        message: `Мінімальна довжина: ${ruleSet.minLength} символів (у вас ${password.length})`
    };

    // Перевірка кожного обов’язкового набору символів
    const setChecks = ruleSet.requiredSets.map(setKey => {
        const set = charSets[setKey];
        const isValid = set.regex.test(password);
        return {
            valid: isValid,
            message: `Має містити ${set.description}`
        };
    });

    // Визначення кількості використаних різних наборів
    const usedSets = Object.values(charSets).filter(set => set.regex.test(password));
    const setsUsedCheck = {
        valid: usedSets.length >= ruleSet.minSets,
        message: `Використано ${usedSets.length} з ${ruleSet.minSets} необхідних наборів`
    };

    // Оцінка складності
    const baseScore = password.length * 4 + usedSets.length * 10;
    const cappedScore = Math.min(100, baseScore);

    let strengthLevel = {
        text: 'Низька',
        color: 'red'
    };
    if (cappedScore >= 80) {
        strengthLevel = {
            text: 'Висока',
            color: 'green'
        };
    } else if (cappedScore >= 50) {
        strengthLevel = {
            text: 'Середня',
            color: 'orange'
        };
    }

    return {
        isValid: lengthCheck.valid && setsUsedCheck.valid,
        passwordStrength: {
            score: cappedScore,
            level: strengthLevel
        },
        lengthCheck,
        setChecks,
        setsUsedCheck
    };
}
