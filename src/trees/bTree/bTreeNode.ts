import { COLORS } from "../../utils/colors";

export class BTreeNode {
  order: number;
  keys: number[];
  children: (BTreeNode | null)[];
  parent: BTreeNode | null;

  constructor(order: number) {
    this.order = order;
    this.keys = [];
    this.children = [];
    this.parent = null;
  }

  isEmpty() {
    return this.keys.length == 0;
  }

  isFilled() {
    return this.keys.length >= this.order;
  }

  isOverflow() {
    return this.children.length > this.order;
  }

  isUnderFlow() {
    return this.children.length < Math.ceil(this.order / 2);
  }

  isMoreThanMinKeys() {
    return this.children.length > Math.ceil(this.order / 2);
  }

  isLeafNode() {
    return this.children.filter((child) => child != null).length == 0;
  }

  childIndex() {
    if (!this.parent) return null;

    let i = 0;
    for (let child of this.parent.children) {
      if (child == this) return i;
      i++;
    }
    return null;
  }

  leftSibling(): BTreeNode | null {
    if (!this.parent) return null;

    const childIdx = this.childIndex()!;

    return childIdx == 0 ? null : this.parent.children[childIdx - 1];
  }

  rightSibling() {
    if (!this.parent) return null;

    const childIdx = this.childIndex()!;

    return childIdx == this.parent.children.length - 1
      ? null
      : this.parent.children[childIdx + 1];
  }

  getInsertIndex(value: number) {
    return this.keys.some((key) => key > value)
      ? this.keys.findIndex((key) => key > value)
      : this.keys.length;
  }

  searchNode(value: number): BTreeNode | null {
    if (this.keys.includes(value)) {
      return this;
    }

    if (this.isLeafNode()) {
      return null;
    }

    const index = this.getInsertIndex(value);
    return this.children[index]!.searchNode(value);
  }

  findNode(value: number): BTreeNode {
    if (this.isLeafNode()) {
      return this;
    }

    for (let i = 0; i < this.keys.length; i++) {
      const ithKey = this.keys[i];
      const ithChild = this.children[i];
      if (value < ithKey && ithChild) {
        return ithChild.findNode(value);
      }
    }

    return this.children[this.children.length - 1]!.findNode(value);
  }

  insertKeyAt(key: number, pos: number) {
    this.keys = [...this.keys.slice(0, pos), key, ...this.keys.slice(pos)];
  }

  insertChildAt(child: BTreeNode | null, pos: number) {
    this.children = [
      ...this.children.slice(0, pos),
      child,
      ...this.children.slice(pos),
    ];
  }

  inOrder() {
    const res: number[] = [];
    this.children.forEach((child, i, arr) => {
      child && res.push(...child.inOrder());

      if (i !== arr.length - 1) res.push(this.keys[i]);
    });
    return res;
  }

  leftOf(value: number) {
    const index = this.keys.findIndex((key) => key === value);
    if (index == -1) return null;
    return this.children[index];
  }

  rightOf(value: number) {
    const index = this.keys.findIndex((key) => key === value);
    if (index == -1) return null;
    return this.children[index + 1];
  }

  inorderSucc(value: number): [number, BTreeNode] | [-1, null] {
    const right = this.rightOf(value);
    if (!right) return [-1, null];

    let node = right;
    while (true) {
      if (node.children[0]) {
        node = node.children[0];
      } else {
        return [node.keys[0], node];
      }
    }
  }

  inorderPred(value: number): [number, BTreeNode] | [-1, null] {
    const left = this.leftOf(value);
    if (!left) return [-1, null];

    let node = left;
    while (true) {
      const rightMost = node.children[node.children.length - 1];
      if (rightMost) {
        node = rightMost;
      } else {
        return [node.keys[node.keys.length - 1], node];
      }
    }
  }

  toString() {
    const childIdx = this.childIndex();
    const parentval =
      this.parent && childIdx != this.parent.keys.length
        ? this.parent.keys[childIdx as number]
        : "";
    return (
      "[" +
      COLORS.reset +
      COLORS.fg.yellow +
      this.keys +
      COLORS.reset +
      "]" +
      // this.children.length +
      " " +
      COLORS.fg.cyan +
      parentval +
      COLORS.reset +
      " "
    );
  }
}
