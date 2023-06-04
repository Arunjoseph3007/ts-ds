import { BTreeNode } from "./bTreeNode";

/**
 * A node in BTree of order m has atmost m children and m-1 keys
 * and a minimum of `ceil(m/2) - 1` children
 *
 * In a BTree all leaf nodes are in the same level
 *
 * All the keys and children are in sorted order
 *
 * An Order 3 B Tree looks like
 * ```
 *                     [9]
 *           ___________|_____________________
 *          |                                |
 *        [3,6]                         [12,15,18]
 *     _____|_________          ____________|_______________
 *    |      |       |         |       |         |         |
 * [1,2]  [4,5]   [7,8]    [10,11]  [13,14]   [16,17]   [19,20]
 *
 *
 * ```
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

    if (this.root!.searchNode(value)) return;
    // @ If tree is not empty
    else {
      const node = this.findNode(value);

      this.insertToLeaf(node, value);
    }
    return this;
  }

  delete(value: number) {
    console.log(`Delet`, value);

    if (!this.root) {
      throw new Error("Tree is empty");
    }
    const node = this.root.searchNode(value);

    if (!node) {
      throw new Error(`Value: ${value} is not present`);
    }

    if (node.isLeafNode()) {
      node.keys = node.keys.filter((key) => key != value);
      node.children.pop();
      this.fixDeletion(node);
    }
    // @ If node is internal node
    else {
    }
  }

  size() {
    return this.root?.inOrder().length || 0;
  }

  private fixDeletion(node: BTreeNode) {
    if (node == this.root || !node.isUnderFlow()) return;

    const parent = node.parent!;
    const leftSibling = node.leftSibling();
    const rightSibling = node.rightSibling();
    const childIdx = node.childIndex()!;

    // @ Try borrowing from left
    if (leftSibling && leftSibling.isMoreThanMinKeys()) {
      const lastKeyOfLeftSibling = leftSibling.keys.pop() as number;
      const lastChildOfleftSibling = leftSibling.children.pop()!;
      node.keys.unshift(parent.keys[childIdx - 1]);
      node.children.unshift(lastChildOfleftSibling);
      parent.keys[childIdx - 1] = lastKeyOfLeftSibling;
    }
    // @ Try borrowing from right
    else if (rightSibling && rightSibling.isMoreThanMinKeys()) {
      const firstKeyOfRightSibling = rightSibling.keys.shift() as number;
      const firstChildofRightSibling = rightSibling.children.shift()!;
      node.keys.push(parent.keys[childIdx]);
      node.children.push(firstChildofRightSibling);
      parent.keys[childIdx] = firstKeyOfRightSibling;
    }
    // @ If left sibling merge with if
    else if (leftSibling) {
      const keyFromParent = parent.keys[childIdx - 1];
      node.keys = [...leftSibling.keys, keyFromParent, ...node.keys];
      node.children = [...leftSibling.children, ...node.children];
      parent.keys = parent.keys.filter((key) => key != keyFromParent);
      parent.children = parent.children.filter((child) => child != leftSibling);
    }
    // @ If right sibling merge with if
    else if (rightSibling) {
      const keyFromParent = parent.keys[childIdx];
      node.keys = [...node.keys, keyFromParent, ...rightSibling.keys];
      node.children = [...node.children, ...rightSibling.children];
      parent.keys = parent.keys.filter((key) => key != keyFromParent);
      parent.children = parent.children.filter((ch) => ch != rightSibling);
    }

    this.fixDeletion(parent);
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
    let insertIndex = node.getInsertIndex(value);
    node.insertKeyAt(value, insertIndex);
    node.children.push(null);

    this.splitNode(node);
  }

  private splitNode(node: BTreeNode) {
    if (!node.isOverflow()) return;

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
    const insertIndex = parent.getInsertIndex(medianKey);
    parent.insertKeyAt(medianKey, insertIndex);
    parent.insertChildAt(newNode, insertIndex + 1);

    this.splitNode(parent);
  }
}
