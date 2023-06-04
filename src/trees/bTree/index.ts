import { input } from "../../utils/prompt";
import { BTree } from "./bTree";

const bTree = new BTree(4);

for (let inp = 0; inp < 25; inp++) {
  bTree.insert(+inp);
}

const ask = async () => {
  while (true) {
    const response = (await input("Enter command: ")).toLowerCase();
    if (response == "exit") break;

    const [command, value] = response.split(" ");

    if (command == "put") {
      bTree.insert(+value);
    } else if (command == "del") {
      bTree.delete(+value);
    }
    console.log(bTree.toString());
  }
};

ask();
