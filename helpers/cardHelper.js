/**
 * Mask card number keeping only first 4 and last 4 digits (e.g. 8600 **** **** 1234)
 */
const maskCardNumber = (cardNumber = "") => {
  const cleanNumber = String(cardNumber).replace(/\s+/g, "");
  if (cleanNumber.length < 8) return cleanNumber;
  const start = cleanNumber.slice(0, 4);
  const end = cleanNumber.slice(-4);
  return `${start} **** **** ${end}`;
};

/**
 * Basic Luhn algorithm card check
 */
const isValidCardNumber = (cardNumber = "") => {
  const sanitized = String(cardNumber).replace(/\D/g, "");
  if (sanitized.length < 13 || sanitized.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

module.exports = {
  maskCardNumber,
  isValidCardNumber,
};
