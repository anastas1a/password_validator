// === Конфігурація ===

const charSets = {
  lowercase: { name: 'Малі латинські літери', regex: /[a-z]/ },
  uppercase: { name: 'Великі латинські літери', regex: /[A-Z]/ },
  digits:    { name: 'Цифри', regex: /\d/ },
  special:   { name: 'Спецсимволи', regex: /[!@#$%^&*()_\-+=\[\]{}|\\:;"'<>,.?/]/ },
};

const config = {
  minLength: 8,
  minSetsRequired: 2
};

// === Основна функція ===

function validatePassword(password, config, charSets) {
  const checks = Object.entries(charSets).map(([key, set]) => ({
    key,
    name: set.name,
    valid: set.regex.test(password)
  }));

  const usedSets = checks.filter(c => c.valid).length;

  const lengthValid = password.length >= config.minLength;
  const setsValid = usedSets >= config.minSetsRequired;

  const score = Math.min(20, password.length * 4) +
                usedSets * 10 +
                Math.min(30, password.length * usedSets);

  const strength = score >= 70 ? 'Сильний' :
                   score >= 40 ? 'Середній' : 'Слабкий';

  return {
    isValid: lengthValid && setsValid,
    length: password.length,
    setsUsed: usedSets,
    checks,
    score,
    strength
  };
}

// === Рендеринг ===

function displayTestResult(container, passed, label) {
  const div = document.createElement('div');
  div.className = `test-result ${passed ? 'test-passed' : 'test-failed'}`;
  div.textContent = `${label} – ${passed ? 'Успішно' : 'Провалено'}`;
  container.appendChild(div);
}

function clearResults(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
}

function runUnitTest(container, password) {
  container.innerHTML = '';
  
  const title = document.createElement('h2');
  title.textContent = 'Юніт-тести для паролю: ' + password;
  container.appendChild(title);

  // Перевірка наявності кожного набору символів
  for (const [setKey, setInfo] of Object.entries(charSets)) {
    const result = validatePassword(password, config, charSets);
    const check = result.checks.find(c => c.key === setKey);
    displayTestResult(
      container, 
      check.valid, 
      `Пароль "${password}" ${check.valid ? 'містить' : 'не містить'} ${setInfo.name}`
    );
  }
}

function runIntegrationTest(container, password) {
  container.innerHTML = '';
  
  const title = document.createElement('h2');
  title.textContent = 'Інтеграційний тест для паролю: ' + password;
  container.appendChild(title);

  const result = validatePassword(password, config, charSets);
  
  // Загальний результат валідації
  const resultDiv = document.createElement('div');
  resultDiv.className = `test-result ${result.isValid ? 'test-passed' : 'test-failed'}`;
  resultDiv.innerHTML = `<strong>Загальний результат:</strong> ${result.isValid ? 'Валідний' : 'Невалідний'} пароль`;
  container.appendChild(resultDiv);
  
  // Детальна інформація
  const details = document.createElement('div');
  details.className = 'test-details';
  details.innerHTML = `
    <p><strong>Довжина:</strong> ${result.length} символів (мінімум ${config.minLength}) - 
       ${result.length >= config.minLength ? '<span class="passed">Успішно</span>' : '<span class="failed">Провалено</span>'}</p>
    <p><strong>Використано наборів символів:</strong> ${result.setsUsed} (мінімум ${config.minSetsRequired}) - 
       ${result.setsUsed >= config.minSetsRequired ? '<span class="passed">Успішно</span>' : '<span class="failed">Провалено</span>'}</p>
    <p><strong>Оцінка міцності:</strong> ${result.score}/100 (${result.strength})</p>
  `;
  container.appendChild(details);
  
  // Детальна інформація про кожен набір
  const setsList = document.createElement('ul');
  setsList.className = 'sets-list';
  result.checks.forEach(check => {
    const item = document.createElement('li');
    item.innerHTML = `${check.name}: ${check.valid ? '<span class="passed">Присутні</span>' : '<span class="failed">Відсутні</span>'}`;
    setsList.appendChild(item);
  });
  container.appendChild(setsList);
}


// === Функції ініціалізації ===

function initializeUI() {
  const root = document.getElementById('test-container');
  
  // Створення елементів форми введення
  const inputForm = document.createElement('div');
  inputForm.className = 'password-input-form';
  inputForm.innerHTML = `
    <div class="input-group">
      <label for="password-input">Введіть пароль для тестування:</label>
      <input type="text" id="password-input" placeholder="Введіть пароль...">
    </div>
    <div class="button-group">
      <button id="run-unit-test">Запустити юніт-тести</button>
      <button id="run-integration-test">Запустити інтеграційний тест</button>
    </div>
  `;
  
  root.appendChild(inputForm);
  
  // Створення контейнера для результатів
  const resultsContainer = document.createElement('div');
  resultsContainer.id = 'test-results';
  resultsContainer.className = 'test-container';
  root.appendChild(resultsContainer);
  
  // Додавання обробників подій для кнопок
  document.getElementById('run-unit-test').addEventListener('click', () => {
    const password = document.getElementById('password-input').value;
    runUnitTest(document.getElementById('test-results'), password);
  });
  
  document.getElementById('run-integration-test').addEventListener('click', () => {
    const password = document.getElementById('password-input').value;
    runIntegrationTest(document.getElementById('test-results'), password);
  });
  
  document.getElementById('run-standard-tests').addEventListener('click', () => {
    runStandardTests(document.getElementById('test-results'));
  });
}

// === Запуск ===

window.addEventListener('DOMContentLoaded', () => {
  initializeUI();
});