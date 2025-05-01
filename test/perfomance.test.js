/**
 * Файл для тестування продуктивності валідації паролів
 */
document.addEventListener('DOMContentLoaded', function() {
    // Знаходимо елементи інтерфейсу
    const generateBtn = document.getElementById('generate-btn');
    const timeDisplay = document.getElementById('time-display');
    const resultsLog = document.getElementById('results-log');
    
    // Перевіряємо, чи знайдені необхідні елементи
    if (generateBtn && timeDisplay && resultsLog) {
      console.log('Елементи інтерфейсу знайдено успішно');
      
      // Перевіряємо наявність необхідних функцій
      if (typeof validatePassword === 'undefined' || typeof variants === 'undefined' || typeof charSets === 'undefined') {
        console.error('Помилка: Не знайдено необхідні функції або об\'єкти для валідації пароля');
        timeDisplay.textContent = 'Помилка: Необхідні функції не знайдено. Перевірте консоль браузера.';
        timeDisplay.style.color = 'red';
        return;
      }
      
      // Функція для генерації пароля заданої довжини
      function generatePassword(length) {
        // Створюємо пароль з маленьких літер і однієї цифри на кінці
        return 'a'.repeat(length - 1) + '1';
      }
      
      // Додає результат до логу
      function addResultToLog(passwordLength, timeMs) {
        const resultItem = document.createElement('div');
        resultItem.innerHTML = `<strong>Довжина пароля:</strong> ${passwordLength} символів | <strong>Час виконання:</strong> ${timeMs.toFixed(3)} мс`;
        resultsLog.appendChild(resultItem);
      }
      
      // Налаштування для тестування
      const simpleValidator = function(password) {
        // Спрощена функція валідації для випадку, якщо основна недоступна
        return {
          isValid: password.length >= 8,
          lengthCheck: { valid: password.length >= 8, message: 'Довжина: ' + password.length },
          setsUsedCheck: { valid: true, usedSets: 2, message: 'Використані набори: 2' },
          setChecks: []
        };
      };
      
      // Обробник кліку на кнопку тестування
      generateBtn.addEventListener('click', function() {
        console.log('Кнопка тестування натиснута');
        
        // Очищуємо попередні результати
        resultsLog.innerHTML = '';
        timeDisplay.textContent = 'Виконуються тести...';
        
        // Розміри паролів для тестування
        const lengthsToTest = [8, 16, 32, 64, 128, 256, 512, 1024];
        
        // Функція для валідації пароля (використовуємо доступну або спрощену)
        const validator = (typeof validatePassword === 'function' && typeof variants !== 'undefined' && typeof charSets !== 'undefined') 
          ? function(pwd) { return validatePassword(pwd, variants.variant1, charSets); }
          : simpleValidator;
        
        // Для уникнення блокування інтерфейсу, запускаємо тести асинхронно
        setTimeout(function runTests() {
          try {
            console.log('Починаємо тестування...');
            
            // Тестуємо паролі різної довжини
            lengthsToTest.forEach(length => {
              const password = generatePassword(length);
              
              // Вимірюємо час виконання
              const startTime = performance.now();
              const result = validator(password);
              const endTime = performance.now();
              
              const elapsedTimeMs = endTime - startTime;
              console.log(`Пароль довжиною ${length}: ${elapsedTimeMs.toFixed(3)} мс`);
              
              // Додаємо результат до логу
              addResultToLog(length, elapsedTimeMs);
            });
            
            // Тестуємо дуже довгий пароль
            timeDisplay.textContent = 'Тестування дуже довгого пароля...';
            setTimeout(function() {
              try {
                const longPasswordLength = 10000;
                const longPassword = generatePassword(longPasswordLength);
                
                const startLongTime = performance.now();
                const longResult = validator(longPassword);
                const endLongTime = performance.now();
                
                const longElapsedTimeMs = endLongTime - startLongTime;
                console.log(`Довгий пароль (${longPasswordLength}): ${longElapsedTimeMs.toFixed(3)} мс`);
                
                addResultToLog(longPasswordLength, longElapsedTimeMs);
                timeDisplay.textContent = 'Всі тести успішно завершено!';
                timeDisplay.style.color = 'green';
              } catch (error) {
                console.error('Помилка при тестуванні довгого пароля:', error);
                timeDisplay.textContent = 'Помилка під час тестування. Перевірте консоль браузера.';
                timeDisplay.style.color = 'red';
              }
            }, 100);
          } catch (error) {
            console.error('Помилка під час тестування:', error);
            timeDisplay.textContent = 'Помилка під час тестування. Перевірте консоль браузера.';
            timeDisplay.style.color = 'red';
          }
        }, 10);
      });
      
      console.log('Обробник події для кнопки тестування встановлено');
    } else {
      console.error('Не вдалося знайти необхідні елементи для тестування продуктивності');
    }
  });