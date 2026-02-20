 /*console.log("1");
 setTimeout(() => {
     console.log("2");
 }, 0);
 console.log("3"); */
//console.log("1");

/*setTimeout(() => {
  console.log("2 - timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("3 - promise");
});

console.log("4"); */
async function test() {
  console.log("1");
  await Promise.resolve();
  console.log("2");
}

console.log("3");
test();
console.log("4");
