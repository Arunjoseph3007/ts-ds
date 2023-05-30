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

  isOverflown() {
    return this.children.length > this.order;
  }

  isLeafNode() {
    return this.children.filter((child) => child != null).length == 0;
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
}
