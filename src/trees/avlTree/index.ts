import { AVLTree } from "./avlTree";

let avl = new AVLTree();

for (let i = 1; i < 50; i++) {
  avl.insert(i);
}

console.log("" + avl);
// for (let i = 20; i > 1; i--) {
//   console.log("deleting", i);
//   avl.delete(i);
//   avl.print();
// }
