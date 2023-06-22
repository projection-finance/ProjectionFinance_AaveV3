Object.defineProperty(Number.prototype, 'truncateDecimals', {
  value: function(decimalPlaces) {
    const factor = Math.pow(10, decimalPlaces);
    const truncatedNumber = Math.trunc(this * factor) / factor;
    const integerPart = Math.trunc(truncatedNumber);
    const decimalPart = truncatedNumber - integerPart;

    return decimalPart === 0 ? integerPart : truncatedNumber;
  },
  writable: true,
  configurable: true,
  enumerable: false
});

const Maths = {
  // Ajoutez ici toutes les autres fonctions que vous voulez inclure dans Maths
};

export default Maths;