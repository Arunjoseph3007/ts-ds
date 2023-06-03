import { BTree } from "./bTree";

const bTree = new BTree(4);

for (let inp = 0; inp < 20; inp++) {
  bTree.insert(inp);
  console.log(inp, `${bTree}`);
}

console.log(bTree.root?.inOrder());
