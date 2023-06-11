import { AVLTree } from "./avlTree";

let avl = new AVLTree();

for (let i = 1; i < 21; i++) {
  avl.insert(i);
  avl.print();
}
