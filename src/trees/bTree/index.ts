import { BTree } from "./bTree";

const bTree = new BTree(5);

for (let inp = 0; inp < 15; inp++) {
  bTree.insert(+inp);
}
bTree.insert(-1)
bTree.insert(6.5)

console.log(bTree.toString())
bTree.delete(14)
console.log(bTree.toString())
bTree.delete(3)
console.log(bTree.toString())
bTree.delete(6.5)
console.log(bTree.toString())
