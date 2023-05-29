import { COLORS } from "../../utils/colors";

export class SinglyLinkedListNode<T = number> {
  value: T;
  next: SinglyLinkedListNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }

  printNode = <T>() => {
    process.stdout.write(`${this}`);

    if (this.next) {
      process.stdout.write("->");
      this.next.printNode();
    }
  };

  toString() {
    return (
      COLORS.reset +
      COLORS.fg.white +
      COLORS.bg.black +
      " " +
      this.value +
      " " +
      COLORS.reset
    );
  }
}
