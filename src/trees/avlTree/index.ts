import { AVLTree } from "./avlTree";

const avl = new AVLTree();
const nos: number[] = [];

for (let i = 0; i < 50; i++) {
  const l = Math.floor(Math.random() * 200);
  nos.push(l);
  avl.insert(l);
}

console.log(''+avl);


for (let i = 0; i < 20; i++) {
  const l = Math.floor(Math.random() * 50);
  avl.delete(nos[l])
  console.log(''+avl);

}
