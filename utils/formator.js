
function convertTimeToSeconds(timeString) {
  // Séparer les heures et les minutes en utilisant le caractère ':' comme séparateur
  const [hours, minutes] = timeString.split(':').map(Number);

  // Convertir les heures en secondes
  const hoursInSeconds = hours * 3600;

  // Convertir les minutes en secondes
  const minutesInSeconds = minutes * 60;

  // Calculer le total des secondes
  const totalSeconds = hoursInSeconds + minutesInSeconds;

  // Retourner le résultat
  return totalSeconds;
}

function convertSecondsToTime(totalSeconds) {
  // Calculer les heures, minutes et secondes
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  const seconds = Math.floor(totalSeconds - hours * 3600 - minutes * 60);

  // Formater la chaîne de temps
  //const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  // Retourner le résultat
  return timeString;
}

function formatCurrency(number) {
  const formatting = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  return formatting.format(number);
}

function formatNumber(number) {
  const formatting = new Intl.NumberFormat("en-US", { maximumSignificantDigits: 10 });
  return formatting.format(number);
}

function formatDecimal(decimals) {
  var multiple = 10;
  for (var i = 0; i < decimals; i++) {
    multiple = multiple * 10;
  }
  return multiple;
}

function calcEvolution(starValue, endValue) {
  if (starValue == null || endValue == null) return "-";
  let delta = endValue - starValue;
  let evol = ((delta * 100) / starValue).toPrecision(3);
  return evol >= 0 ? <span className="text-green-pistachio">{evol + "%"}</span> : <span className="text-red-sizy">{evol + "%"}</span>;
}

function calcTrend(starValue, endValue) {
  if (!starValue || !endValue) return "-";
  let delta = endValue - starValue;
  return delta > 0 ? "Bullish" : "Bearish";
}

function average(tokenPosition, param = "sigma") {
  let count = 0;
  tokenPosition?.map((position) => {
    count += position?.config[param];
  });
  return count / tokenPosition.length;
}

export const Formator = {
  formatCurrency,
  formatNumber,
  formatDecimal,
  calcEvolution,
  calcTrend,
  average,
  convertTimeToSeconds,
  convertSecondsToTime
};
