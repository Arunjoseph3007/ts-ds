import { BTreeNode } from "./bTreeNode";

/**
 * A node in BTree of order m has atmost m children and m-1 keys
 * and a minimum of `ceil(m/2) - 1` children
 *
 * In a BTree all leaf nodes are in the same level
 *
 * All the keys and children are in sorted order
 */
export class BTree {
  order: number;
  root: BTreeNode | null;

  constructor(order: number) {
    this.order = order;
    this.root = null;
  }

  isEmpty() {
    return !this.root;
  }

  insert(value: number) {
    // @ If tree is empty
    if (this.isEmpty()) {
      const newNode = new BTreeNode(this.order);
      newNode.children = [null, null];
      newNode.keys = [value];
      this.root = newNode;
      return;
    }
    // @ If tree is not empty
    else {
      const node = this.findNode(value);

      this.insertToLeaf(node, value);
    }
    return this;
  }

  toString() {
    let str = "";
    let queue = [this.root];

    while (queue.filter(Boolean).length) {
      const newQueue: (BTreeNode | null)[] = [];

      queue.forEach((node) => {
        if (node) {
          str += node;
          newQueue.push(...node.children);
        }
      });

      str += "\n";
      queue = newQueue;
    }
    return str;
  }

  private findNode(value: number) {
    if (!this.root) {
      throw "No root";
    }
    return this.root.findNode(value);
  }

  private insertToLeaf(node: BTreeNode, value: number) {
    const insertIndex =
      node.keys.find((key) => key > value) || node.keys.length;

    node.insertKeyAt(value, insertIndex);
    node.children.push(null);

    this.splitNode(node);
  }

  private splitNode(node: BTreeNode) {
    if (!node.isOverflown()) return;

    if (node == this.root) {
      this.splitRoot(node);
    } else {
      this.splitNonRoot(node);
    }
  }

  private splitRoot(node: BTreeNode) {
    const medianIndex = Math.floor(node.keys.length / 2);
    const medianKey = node.keys[medianIndex];
    const newRoot = new BTreeNode(this.order);

    // @ Make new node
    const newNode = new BTreeNode(this.order);
    newNode.parent = newRoot;
    newNode.keys = node.keys.slice(medianIndex + 1);
    newNode.children = node.children.slice(medianIndex + 1);
    newNode.children.forEach((child) => {
      if (child) child.parent = newNode;
    });

    // @ Update this node
    node.parent = newRoot;
    node.keys = node.keys.slice(0, medianIndex);
    node.children = node.children.slice(0, medianIndex + 1);

    // @ Update parent
    newRoot.keys.push(medianKey);
    newRoot.children.push(node, newNode);

    // @ Update root
    this.root = newRoot;
  }

  private splitNonRoot(node: BTreeNode) {
    const medianIndex = Math.floor(node.keys.length / 2);
    const medianKey = node.keys[medianIndex];
    const parent = node.parent as BTreeNode;

    // @ Make new node
    const newNode = new BTreeNode(this.order);
    newNode.parent = parent;
    newNode.keys = node.keys.slice(medianIndex + 1);
    newNode.children = node.children.slice(medianIndex + 1);
    newNode.children.forEach((child) => {
      if (child) child.parent = newNode;
    });

    // @ Update this node
    node.keys = node.keys.slice(0, medianIndex);
    node.children = node.children.slice(0, medianIndex + 1);

    // @ Update parent
    const insertIndex =
      parent.keys.find((key) => key > medianKey) || parent.keys.length;
    parent.insertKeyAt(medianKey, insertIndex);
    parent.insertChildAt(newNode, insertIndex + 1);

    this.splitNode(parent);
  }
}