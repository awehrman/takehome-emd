'use client';

import React from 'react';


const cleanCreditCardValue = (value: string): string => value.replace(/-|\s/g, '');
const formatCreditCardValue = (value: string): string => value.replace(/(.{4})/g, '$1 ');

const isLunhValidCreditCardNumber = (value: string = ''): boolean => {
  let sum = 0;
  let shouldDouble = false;

  // iterate through the credit card number from right to left
  for (let i = value.length - 1; i >= 0; i--) {
    let digit = parseInt(value.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

const isValidCreditCardNumber = (value: string ): boolean => {
  const cleanValue = cleanCreditCardValue(value);

  const isLengthValid = cleanValue.length <= MAX_VALID_CREDIT_CARD_LENGTH && cleanValue.length >= MIN_VALID_CREDIT_CARD_LENGTH;
  if (!isLengthValid) {
    return false;
  }

  const isPatternValid = CREDIT_CARD_VALIDATOR_PATTERN.test(cleanValue);
  if (!isPatternValid) {
    return false;
  }

  const isLuhnValid = isLunhValidCreditCardNumber(cleanValue);
  return isLuhnValid;
}

const CREDIT_CARD_VALIDATOR_PATTERN = /^\d*$/;
const MIN_VALID_CREDIT_CARD_LENGTH = 12;
const MAX_VALID_CREDIT_CARD_LENGTH = 19; 

// 4640 1820 9691 8382
// 4640182096918382

const CreditCardValidator: React.FC = () => {
  const [inputValue, setInputValue] = React.useState<string>('');
  const [isValid, setIsValid] = React.useState<boolean>(false);
  const label = 'Credit Card Number:';
  const fieldName = 'credit-card-number';

  function handleCreditCardNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    const cleanValue = cleanCreditCardValue(value);
    const reformatValue = formatCreditCardValue(cleanValue);
    setInputValue(reformatValue);

    const isValid = isValidCreditCardNumber(value);
    setIsValid(isValid);
  }

  return (
    <div>
      {/* CC Input Field */}
      <label htmlFor={fieldName}>{label}</label>
      <input
        id={fieldName}
        aria-label={label}
        onChange={handleCreditCardNumberChange}
        defaultValue={inputValue}
        type="tel"
        inputMode="numeric"
        autoComplete="cc-number"
        maxLength={19}
        placeholder="**** **** **** ****"
        required
      />

      {/* Validation Status */}
      {isValid
        ? <p style={{ color: 'green' }}>Valid credit card number</p>
        : <p style={{ color: 'tomato' }}>Invalid credit card number</p>}
    </div>
  );
};

export default CreditCardValidator;