document.addEventListener('DOMContentLoaded', function() {
    console.log('Performance script loaded');
  
    const generateBtn = document.getElementById('generate-btn');
    const timeDisplay = document.getElementById('time-display');
    const resultsLog = document.getElementById('results-log');
    
    // Перелік довжин паролів для тестування
    const passwordLengths = [8, 16, 32, 64, 128, 256, 512, 1024];
    
    // Генерація випадкового пароля заданої довжини з різними наборами символів
    function generateRandomPassword(length) {
      const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
      const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const digits = '0123456789';
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      
      // Об'єднуємо всі набори символів
      const allChars = lowerChars + upperChars + digits + specialChars;
      
      // Переконуємося, що пароль міститиме хоча б один символ із кожного набору
      let password = '';
      
      // Додаємо по одному символу з кожного набору
      password += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
      password += upperChars.charAt(Math.floor(Math.random() * upperChars.length));
      password += digits.charAt(Math.floor(Math.random() * digits.length));
      password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
      
      // Заповнюємо решту пароля випадковими символами
      for (let i = 4; i < length; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
      }
      
      // Перемішуємо символи в паролі
      return password.split('').sort(() => 0.5 - Math.random()).join('');
    }
    
    // Функція для маскування пароля (показуємо лише початок і кінець)
    function maskPassword(password) {
      if (password.length <= 20) {
        return password;
      }
      
      const visibleChars = 10;
      return password.substring(0, visibleChars) + '...' + 
             password.substring(password.length - visibleChars);
    }
    
    // Функція виміру часу виконання валідації пароля
    function measureValidationTime(password) {
      // Виконуємо 100 разів для точніших вимірювань при коротких паролях
      const iterations = 100;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        validatePassword(password, variants.variant1, charSets);
      }
      
      const endTime = performance.now();
      return ((endTime - startTime) / iterations).toFixed(3); // Середній час у мс
    }
    
    // Функція для додавання кнопки "Показати повністю"
    function createShowButton(password, resultElement) {
      const showBtn = document.createElement('button');
      showBtn.textContent = 'Показати повністю';
      showBtn.className = 'show-password-btn';
      
      showBtn.addEventListener('click', function() {
        const passwordText = document.createElement('div');
        passwordText.innerHTML = `<pre style="white-space: pre-wrap; word-break: break-all;">${password}</pre>`;
        
        // Замінюємо кнопку на повний текст пароля
        showBtn.replaceWith(passwordText);
      });
      
      return showBtn;
    }
    
    // Функція для тестування всіх довжин паролів
    function runAllTests() {
      resultsLog.innerHTML = '';
      timeDisplay.textContent = 'Тестування всіх довжин паролів...';
      
      // Використовуємо setTimeout, щоб дати браузеру оновити інтерфейс
      setTimeout(() => {
        const results = [];
        
        // Тестуємо кожну довжину
        for (const length of passwordLengths) {
          const password = generateRandomPassword(length);
          const time = measureValidationTime(password);
          
          results.push({ length, password, time });
        }
        
        // Відображаємо результати
        displayResults(results);
        timeDisplay.textContent = 'Тестування завершено';
      }, 50);
    }
    
    // Функція для відображення результатів
    function displayResults(results) {
      resultsLog.innerHTML = '';
      
      results.forEach(result => {
        const resultElement = document.createElement('div');
        
        const infoText = document.createElement('p');
        infoText.innerHTML = `<strong>Довжина пароля:</strong> ${result.length} символів | <strong>Час виконання:</strong> ${result.time} мс`;
        
        const passwordContainer = document.createElement('div');
        passwordContainer.innerHTML = `<strong>Пароль:</strong> `;
        
        // Додаємо маскований пароль
        const maskedPasswordSpan = document.createElement('code');
        maskedPasswordSpan.textContent = maskPassword(result.password);
        passwordContainer.appendChild(maskedPasswordSpan);
        
        // Додаємо кнопку "Показати повністю"
        const showBtn = createShowButton(result.password, resultElement);
        passwordContainer.appendChild(showBtn);
        
        resultElement.appendChild(infoText);
        resultElement.appendChild(passwordContainer);
        resultsLog.appendChild(resultElement);
      });
    }
    
    // Обробник кліку на кнопку генерації
    generateBtn.addEventListener('click', runAllTests);
  });