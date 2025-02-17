import base58 from "bs58";

function base58Encode(unit8Array: Uint8Array): string {
  return base58.encode(unit8Array);
}

function unit8ArrayToString(unit8Array: Uint8Array): string {
  let str = "";
  for (let i = 0; i < unit8Array.length; i++) {
    str += String.fromCharCode(unit8Array[i]);
  }
  return str;
}

const byteArray = new Uint8Array([72, 101, 108, 108, 111]);
console.log(base58Encode(byteArray));
console.log(unit8ArrayToString(byteArray));
