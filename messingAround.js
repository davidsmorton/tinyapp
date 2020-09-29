console.log("Scott")


setTimeout(() => {
  console.log("Hello Paige and Ed you guys are late!")
}, 3500);

console.log("Jack and Erin")

let iterations = 0;
const interval = setInterval(() => {
  iterations++;
  console.log('This is a test for setInterval');

  if (iterations === 10) {
    clearInterval(interval);
  }
}, 1000);