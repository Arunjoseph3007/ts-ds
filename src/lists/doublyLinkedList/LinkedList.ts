import DoublyLinkedListNode from "./Node";

export default class DoublyLinkedList<T = number> {
  private pseudoRoot: DoublyLinkedListNode<T>;
  private size: number;

  constructor() {
    this.pseudoRoot = {
      next: null,
      prev: null,
      //@ts-ignore
      value: null,
    };
    this.size = 0;
  }

  get root() {
    return this.pseudoRoot.next;
  }

  set root(node) {
    this.pseudoRoot.next = node;
    if (node) node.prev = this.pseudoRoot;
  }

  getSize() {
    return this.size;
  }

  append(value: T) {
    const node = new DoublyLinkedListNode(value);

    let walk = this.pseudoRoot;
    while (walk.next) {
      walk = walk.next;
    }
    node.prev = walk;
    walk.next = node;
    this.size++;
  }

  prepend(value: T) {
    const node = new DoublyLinkedListNode(value);

    node.next = this.root;
    if (node.next) node.next.prev = node;
    this.root = node;
    this.size++;
  }

  insert(value: T, index: number) {
    if (index >= this.getSize() || index < 0) return;

    const node = new DoublyLinkedListNode(value);
    this.size++;
    let walk = this.pseudoRoot;
    for (let i = 0; i < index; i++) {
      walk = walk.next!;
    }

    node.next = walk.next;
    walk.next = node;
    node.prev = walk;
  }

  delete(value: T) {
    let walk = this.root;

    while (walk) {
      if (walk.value == value) {
        this.size--;
        walk.prev!.next = walk.next;
        if (walk.next) walk.next.prev = walk.prev;
        return;
      }
      walk = walk.next;
    }
  }

  remove(index: number) {
    if (index >= this.getSize() || index < 0) return;

    this.size--;
    let walk = this.pseudoRoot;
    for (let i = 0; i < index; i++) {
      walk = walk.next!;
    }

    walk.next = walk.next?.next || null;
    if (walk.next) {
      walk.next.prev = walk;
    }
  }

  toString() {
    let res = "";
    let walk = this.root;
    while (walk) {
      res += walk + "<=>";
      walk = walk.next;
    }
    return res;
  }
}
