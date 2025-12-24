// Modern Calculator JavaScript
class ModernCalculator {
    constructor() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.memory = 0;
        this.history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
        this.isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.loadTheme();
        this.updateMemoryDisplay();
        this.loadHistory();
    }

    initializeElements() {
        this.previousOperandElement = document.getElementById('previous-operand');
        this.currentOperandElement = document.getElementById('current-operand');
        this.displayOverlay = document.getElementById('display-overlay');
        this.historyPanel = document.getElementById('history-panel');
        this.memoryPanel = document.getElementById('memory-panel');
        this.memoryDisplay = document.getElementById('memory-display');
        this.historyList = document.getElementById('history-list');
        this.themeIcon = document.getElementById('theme-icon');
        this.toastContainer = document.getElementById('toast-container');
    }

    bindEvents() {
        // Button events
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', () => this.handleButtonClick(button));
        });

        // Theme toggle
        document.querySelector('.theme-toggle').addEventListener('click', () => this.toggleTheme());

        // History toggle
        document.getElementById('history-toggle').addEventListener('click', () => this.toggleHistory());
        document.getElementById('history-close').addEventListener('click', () => this.toggleHistory());
        document.getElementById('clear-history').addEventListener('click', () => this.clearHistory());

        // Memory display click
        this.memoryDisplay.addEventListener('click', () => this.toggleMemoryPanel());

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Click outside to close panels
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.history-panel') && !e.target.closest('#history-toggle')) {
                this.historyPanel.classList.remove('active');
            }
            if (!e.target.closest('.memory-panel') && !e.target.closest('#memory-display')) {
                this.memoryPanel.classList.remove('active');
            }
        });
    }

    handleButtonClick(button) {
        this.animateButton(button);
        
        if (button.dataset.number !== undefined) {
            this.appendNumber(button.dataset.number);
        }
        
        if (button.dataset.action !== undefined) {
            this.chooseOperation(button.dataset.action);
        }
        
        if (button.dataset.memory !== undefined) {
            this.handleMemory(button.dataset.memory);
        }
        
        this.updateDisplay();
    }

    handleKeyboard(event) {
        event.preventDefault();
        
        const key = event.key;
        
        if (key >= '0' && key <= '9' || key === '.') {
            this.appendNumber(key);
        } else if (['+', '-', '*', '/', '%'].includes(key)) {
            this.chooseOperation(key);
        } else if (key === 'Enter' || key === '=') {
            this.compute();
        } else if (key === 'Escape') {
            this.clear();
        } else if (key === 'Backspace') {
            this.delete();
        }
        
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
            case 'add':
                computation = prev + current;
                break;
            case '-':
            case 'subtract':
                computation = prev - current;
                break;
            case '*':
            case 'multiply':
                computation = prev * current;
                break;
            case '/':
            case 'divide':
                if (current === 0) {
                    this.showToast('Cannot divide by zero!', 'error');
                    return;
                }
                computation = prev / current;
                break;
            case '%':
            case 'percentage':
                computation = (prev / 100) * current;
                break;
            default:
                return;
        }
        
        // Add to history
        const expression = `${this.previousOperand} ${this.getOperationSymbol()} ${this.currentOperand}`;
        this.addToHistory(expression, computation);
        
        this.currentOperand = this.formatNumber(computation);
        this.operation = undefined;
        this.previousOperand = '';
        
        this.animateDisplay();
    }

    getOperationSymbol() {
        switch (this.operation) {
            case '+':
            case 'add':
                return '+';
            case '-':
            case 'subtract':
                return '-';
            case '*':
            case 'multiply':
                return '×';
            case '/':
            case 'divide':
                return '÷';
            case '%':
            case 'percentage':
                return '%';
            default:
                return '';
        }
    }

    formatNumber(number) {
        const stringNumber = number.toString();
        
        if (stringNumber.includes('e')) {
            return parseFloat(number).toExponential(2);
        }
        
        if (stringNumber.includes('.')) {
            const parts = stringNumber.split('.');
            const integerPart = parts[0];
            const decimalPart = parts[1];
            
            if (decimalPart.length > 8) {
                return parseFloat(number).toFixed(8);
            }
        }
        
        return stringNumber;
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.currentOperand || '0';
        
        if (this.operation != null && this.previousOperand !== '') {
            this.previousOperandElement.textContent = 
                `${this.previousOperand} ${this.getOperationSymbol()}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }

    animateButton(button) {
        button.classList.add('animate');
        setTimeout(() => {
            button.classList.remove('animate');
        }, 200);
    }

    animateDisplay() {
        this.displayOverlay.classList.add('active');
        setTimeout(() => {
            this.displayOverlay.classList.remove('active');
        }, 600);
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.documentElement.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
        this.themeIcon.className = this.isDarkTheme ? 'fas fa-moon' : 'fas fa-sun';
        localStorage.setItem('isDarkTheme', this.isDarkTheme);
    }

    loadTheme() {
        document.documentElement.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
        this.themeIcon.className = this.isDarkTheme ? 'fas fa-moon' : 'fas fa-sun';
    }

    toggleHistory() {
        this.historyPanel.classList.toggle('active');
    }

    toggleMemoryPanel() {
        this.memoryPanel.classList.toggle('active');
    }

    addToHistory(expression, result) {
        const historyItem = {
            id: Date.now(),
            expression: expression,
            result: result,
            timestamp: new Date().toLocaleString()
        };
        
        this.history.unshift(historyItem);
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        
        localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
        this.renderHistory();
    }

    renderHistory() {
        this.historyList.innerHTML = '';
        
        if (this.history.length === 0) {
            this.historyList.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 20px;">No history yet</div>';
            return;
        }
        
        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-expression">${item.expression} =</div>
                <div class="history-result">${item.result}</div>
            `;
            
            historyItem.addEventListener('click', () => {
                this.currentOperand = item.result.toString();
                this.updateDisplay();
                this.toggleHistory();
            });
            
            this.historyList.appendChild(historyItem);
        });
    }

    loadHistory() {
        this.renderHistory();
    }

    clearHistory() {
        this.history = [];
        localStorage.removeItem('calculatorHistory');
        this.renderHistory();
        this.showToast('History cleared!', 'success');
    }

    handleMemory(action) {
        const current = parseFloat(this.currentOperand) || 0;
        
        switch (action) {
            case 'mc':
                this.memory = 0;
                this.showToast('Memory cleared!', 'success');
                break;
            case 'mr':
                this.currentOperand = this.memory.toString();
                this.showToast('Memory recalled!', 'success');
                break;
            case 'ms':
                this.memory = current;
                this.showToast('Memory saved!', 'success');
                break;
            case 'm+':
                this.memory += current;
                this.showToast('Added to memory!', 'success');
                break;
            case 'm-':
                this.memory -= current;
                this.showToast('Subtracted from memory!', 'success');
                break;
        }
        
        this.updateMemoryDisplay();
        this.updateDisplay();
    }

    updateMemoryDisplay() {
        this.memoryDisplay.innerHTML = `
            <i class="fas fa-memory"></i>
            <span>Memory: ${this.memory}</span>
        `;
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 
                    type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
        
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        this.toastContainer.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Hide toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ModernCalculator();
});

// Add some fun easter eggs
document.addEventListener('DOMContentLoaded', () => {
    let clickCount = 0;
    const logo = document.querySelector('.calculator-header h1');
    
    logo.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 5) {
            const calculator = document.querySelector('.calculator');
            calculator.style.animation = 'spin 1s ease-in-out';
            setTimeout(() => {
                calculator.style.animation = '';
            }, 1000);
            clickCount = 0;
        }
    });
});

// Add CSS for spin animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotateY(0deg); }
        to { transform: rotateY(360deg); }
    }
`;
document.head.appendChild(style);





