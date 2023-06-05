import { BinomialHeap } from "./binomialHeap";

let a = new BinomialHeap();

a.insert(1);
a.insert(2);
a.insert(3);
a.insert(4);
a.insert(5);
a.insert(6);
a.insert(7);

console.log(a.root);
console.log(a.root?.brother?.brother);
