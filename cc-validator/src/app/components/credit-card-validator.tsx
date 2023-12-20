'use client';

import React from 'react';


// i'm just going to throw some utility functions in this same file, but normally i'd like to separate this out to a separate file
// each of these are EXCELLENT candidates for unit tests too

// strip out any user formatting (i.e. spaces, dashes, etc.)
const cleanCreditCardValue = (value: string): string => value.replace(/-|\s/g, '');
// reformat to give us a nicely spaced appearance ("xxxx xxxx xxxx xxxx")
// this could get more intelligent if we knew the type of card used, then we could be specific about how we format
const formatCreditCardValue = (value: string): string => value.replace(/(.{4})/g, '$1 ');

// it's an algorithm! 
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

// this is a fairly simple validation exercise and in real life i would probably reach for a library like 
// https://github.com/braintree/card-validator
// which gives us much stricter validation, a better ability to tease out the type of cc processor, and
// can provide some neat formatting features
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

// ditto on ideally separating out constants to their own file!
// give me only digits!
const CREDIT_CARD_VALIDATOR_PATTERN = /^\d*$/;

// a quick search of the internet told me this is a common range; this is also something i'd validate a bit more irl
const MIN_VALID_CREDIT_CARD_LENGTH = 12;
const MAX_VALID_CREDIT_CARD_LENGTH = 19; 

const CreditCardValidator: React.FC = () => {
  // for the sake of time i'm just going to use some basic useState instances to keep track of our values
  // normally in a cc form, you'd want to rely on a more robust form management library or custom hook

  // here's a more robust react-hook-form example of form state management
  // (https://github.com/awehrman/recipes/blob/bfee2c2eed4aaf11fceb08a0a3864aa14f447ce1/components/parser/rule/index.tsx#L34)

  const [inputValue, setInputValue] = React.useState<string>('');
  const [isValid, setIsValid] = React.useState<boolean>(false);


  // i like to keep these in their own variables so we can easily translate strings if need be with i18n
  const label = 'Credit Card Number:';
  const fieldName = 'credit-card-number';

  // handle our change event to reflect back what we're typing
  function handleCreditCardNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    const cleanValue = cleanCreditCardValue(value);
    // i'm doing just a quick and dirty format, but this is a point where i'd ask if you want to mask
    // a portion of the value as they type as to not show the whole sensitive cc number (i.e. "**** 8234")
    const reformatValue = formatCreditCardValue(cleanValue);
    setInputValue(reformatValue);

    // and again this is where i'd talk to your design/product people on the real life circumstances
    // maybe you don't actually want to validate this on every key stroke! maybe we just want to target
    // event.key === 'Enter' or when they press a button

    // also also, this is a very weak client side validation, i'd expect us to have another layer of 
    // schema validation going on like such as joi (https://github.com/hapijs/joi) to help ensure these
    // values match our expectations all the way down to the server
    const isValid = isValidCreditCardNumber(value);
    setIsValid(isValid);
  }

  return (
    <div>
      {/* CC Input Field */}
      {/* i don't care if you want a visible label or not, but its always a good idea to have one for
          accessibility reasons even if its not in the design */}
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
      {/* i'm also not really focusing on styling anything too much for this example 
          if you want examples of how css proficient i am here's a fun component to judge out of my side project:
          https://github.com/awehrman/recipes/blob/bfee2c2eed4aaf11fceb08a0a3864aa14f447ce1/components/parser/rule/auto-width-input.tsx
      */}
      
      {isValid
        ? <p style={{ color: 'green' }}>Valid credit card number</p>
        : <p style={{ color: 'tomato' }}>Invalid credit card number</p>}
    </div>
  );
};

export default CreditCardValidator;