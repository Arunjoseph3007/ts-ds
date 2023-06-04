import { BTree } from "./bTree";

const bTree = new BTree(5);

for (let inp = 0; inp < 25; inp++) {
  bTree.insert(+inp);
}
console.log(bTree.toString())
bTree.delete(17)
console.log(bTree.toString())
