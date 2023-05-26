import { RedBlackTree } from "./redBlackTree";

const rbTree = new RedBlackTree();

const elms = [10, -5, 15, 14, 12, 20];

for (let el of elms) rbTree.insert(el);

rbTree.print();
rbTree.delete(12);
rbTree.print();
rbTree.delete(15);
rbTree.print();
rbTree.delete(14);
rbTree.print();
