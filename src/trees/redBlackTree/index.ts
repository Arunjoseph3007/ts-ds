import { RedBlackTree } from "./redBlackTree";

const rbTree = new RedBlackTree();

for (let i = 0; i < 50; i++) {
  rbTree.insert(Math.floor(Math.random() * 100));
}

console.log("" + rbTree);
