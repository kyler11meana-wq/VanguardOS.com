
import React, { useState } from 'react';
import AppContainer from '../components/AppContainer.tsx';

const CalculatorApp: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [operand, setOperand] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [isNewEntry, setIsNewEntry] = useState(true);

    const buttons = [
        'AC', '+/-', '%', '÷',
        '7', '8', '9', '×',
        '4', '5', '6', '-',
        '1', '2', '3', '+',
        '0', '.', '='
    ];

    const calculate = (val1: number, op: string, val2: number): number => {
        switch (op) {
            case '+': return val1 + val2;
            case '-': return val1 - val2;
            case '×': return val1 * val2;
            case '÷': return val1 / val2;
            default: return val2;
        }
    };

    const handleButtonClick = (btn: string) => {
        if (!isNaN(parseInt(btn))) { // Number
            if (isNewEntry) {
                setDisplay(btn);
                setIsNewEntry(false);
            } else {
                setDisplay(prev => (prev === '0' ? btn : prev + btn));
            }
        } else {
            const currentValue = parseFloat(display);
            switch (btn) {
                case 'AC':
                    setDisplay('0');
                    setOperand(null);
                    setOperator(null);
                    setIsNewEntry(true);
                    break;
                case '+/-':
                    setDisplay(prev => (parseFloat(prev) * -1).toString());
                    break;
                case '%':
                    setDisplay(prev => (parseFloat(prev) / 100).toString());
                    break;
                case '.':
                    if (!display.includes('.')) {
                        setDisplay(prev => prev + '.');
                    }
                    break;
                case '=':
                    if (operand !== null && operator !== null) {
                        const result = calculate(operand, operator, currentValue);
                        setDisplay(result.toString());
                        setOperand(null);
                        setOperator(null);
                        setIsNewEntry(true);
                    }
                    break;
                default: // Operator
                    if (operand === null) {
                        setOperand(currentValue);
                    } else if (operator) {
                        const result = calculate(operand, operator, currentValue);
                        setOperand(result);
                        setDisplay(result.toString());
                    }
                    setOperator(btn);
                    setIsNewEntry(true);
                    break;
            }
        }
    };

    const isOperator = (btn: string) => ['÷', '×', '-', '+', '='].includes(btn);
    const getButtonClass = (btn: string) => {
        if (isOperator(btn)) return 'bg-gradient-to-br from-orange-500 to-orange-600 active:from-orange-600';
        if (['AC', '+/-', '%'].includes(btn)) return 'bg-gradient-to-br from-gray-500 to-gray-600 active:from-gray-600';
        return 'bg-gradient-to-br from-gray-700 to-gray-800 active:from-gray-800';
    };
    
    const displayFontSize = display.length > 8 ? 'text-6xl' : 'text-7xl';

    return (
        <AppContainer title="">
            <div className="flex flex-col h-full bg-v-bg-dark text-white">
                <div className="flex-grow flex items-end justify-end px-8 pb-4 break-all">
                    <h1 className={`${displayFontSize} font-light transition-all`}>{display}</h1>
                </div>
                <div className="grid grid-cols-4 gap-px bg-gray-900/50">
                    {buttons.map((btn) => (
                        <button
                            key={btn}
                            onClick={() => handleButtonClick(btn)}
                            className={`
                                text-3xl p-6 transition-all duration-150 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-orange-500
                                ${getButtonClass(btn)}
                                ${btn === '0' ? 'col-span-2' : ''}
                            `}
                        >
                            {btn}
                        </button>
                    ))}
                </div>
            </div>
        </AppContainer>
    );
};

export default CalculatorApp;
