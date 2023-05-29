import { SinglyLinkedListNode } from "./linkedListNode";

export class SinglyLinkedList<T = number> {
  private psuedoRoot: { next: SinglyLinkedListNode<T> | null };
  private size: number;

  constructor() {
    this.psuedoRoot = { next: null };
    this.size = 0;
  }

  get root() {
    return this.psuedoRoot.next;
  }

  set root(node) {
    this.psuedoRoot.next = node;
  }

  /**
   * 
   * @returns Size of the linked list
   */
  getSize() {
    return this.size;
  }

  /**
   * 
   * @returns True if list is empty, false otherwise
   */
  isEmpty() {
    return !this.root;
  }

  /**
   * Finds the element at given position
   * @param pos index of where to search, defaults to 0
   * @returns 
   */
  get(pos = 0): [T, true] | [null, false] {
    let walk = this.root;
    if (pos < 0 || !walk) return [null, false];

    for (let i = 0; i < pos; i++) {
      if (!walk.next) {
        return [null, false];
      }
      walk = walk.next;
    }

    return [walk.value, true];
  }

  /**
   * Appends given value at end of the list
   * @param value Valur to be inserted
   * @returns this
   */
  add(value: T) {
    const newNode = new SinglyLinkedListNode(value);

    let walk = this.psuedoRoot;
    while (walk.next) {
      walk = walk.next;
    }

    walk.next = newNode;
    this.size++;
    return this;
  }

  /**
   * Insert a value at given position
   * @param value Value to be inserted
   * @param pos Position where the value is to be inserted
   * @returns 
   */
  insert(value: T, pos = 0): boolean {
    if (pos < 0 || pos > this.size) {
      throw new Error(`pos: ${value} Outside index`);
    }

    const newNode = new SinglyLinkedListNode(value);
    let walk = this.root;
    let prev = this.psuedoRoot;

    for (let i = 0; i < pos; i++) {
      if (!walk) return false;

      prev = walk;
      walk = walk.next;
    }

    newNode.next = prev.next;
    prev.next = newNode;
    this.size++;

    return true;
  }

  /**
   * Delete element at given index
   * @param pos index at which you want to delete
   * @returns 
   */
  delete(pos: number) {
    if (pos < 0 || pos > this.size) {
      throw new Error(`pos: ${pos} outside index`);
    }

    let walk = this.root;
    let prev = this.psuedoRoot;

    for (let i = 0; i < pos; i++) {
      if (!walk) return false;

      prev = walk;
      walk = walk.next;
    }

    prev.next = prev.next?.next || null;
    this.size--;

    return true;
  }

  /**
   * Prints in a linked listy way
   */
  print() {
    if (this.root) this.root.printNode();
    console.log();
  }
}
