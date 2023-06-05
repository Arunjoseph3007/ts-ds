import { BinomialHeap } from "./binomialHeap";

let a = new BinomialHeap();

// new Array(15).forEach((_, i) => a.insert(i + 1));
for (let i = 1; i < 16; i++) a.insert(i);

console.log(a.toString());

a.extractMin()

console.log(a.toString());
a.extractMin()

console.log(a.toString());