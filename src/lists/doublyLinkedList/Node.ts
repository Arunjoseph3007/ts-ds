import { COLORS } from "../../utils/colors";

export default class DoublyLinkedListNode<T = number> {
  value: T;
  next: DoublyLinkedListNode<T> | null;
  prev: DoublyLinkedListNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }

  toString() {
    return (
      COLORS.reset +
      COLORS.fg.white +
      COLORS.bg.black +
      " " +
      //   ((this.prev ? this.prev?.value : "N") + " ") +
      this.value +
      //   (" " + (this.next ? this.next?.value : "N")) +
      " " +
      COLORS.reset
    );
  }
}
