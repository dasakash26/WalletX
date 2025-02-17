function bytesToAscii(byteArray) {
  return new TextDecoder().decode(byteArray);
}
function asciiToBytes(str) {
  return new TextEncoder().encode(str);
}

function arrayToHex(byteArray) {
  let hexString = "";
  for (let i = 0; i < byteArray.length; i++) {
    hexString += byteArray[i].toString(16).padStart(2, "0");
  }
  return hexString;
}

// Example usage:
const bytes = new Uint8Array([72, 101, 108, 108, 111]); // Corresponds to "Hello"
const asciiString = bytesToAscii(bytes);
console.log(asciiString); // Output: "Hello"

const asciiString2 = "Hello";
const bytes2 = asciiToBytes(asciiString2);
console.log(bytes2);

const hexString = arrayToHex(bytes);
console.log(hexString); // Output: "48656c6c6f"
