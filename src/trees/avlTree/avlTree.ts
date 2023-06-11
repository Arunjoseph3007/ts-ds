import { AVLTreeNode } from "./avltreeNode";

export class AVLTree {
  root: AVLTreeNode | null;

  constructor() {
    this.root = null;
  }

  private rotateLeft(node: AVLTreeNode) {
    if (!node.left) {
      throw new Error("A node with no left element cannot be left rotated");
    }

    const initialLeftChild = node.left;

    const dir = node.getDir();
    if (dir == "RIGHT") node.parent!.right = node.left;
    if (dir == "LEFT") node.parent!.left = node.left;
    if (dir == null) this.root = node.left;
    node.left.parent = node.parent;

    node.left = node.left.right;
    if (node.left) node.left.parent = node;

    initialLeftChild.right = node;
    node.parent = initialLeftChild;
  }

  private rotateRight(node: AVLTreeNode) {
    if (!node.right) {
      throw new Error("A node with no right element cannot be left rotated");
    }

    const initialRightChild = node.right;

    const dir = node.getDir();
    if (dir == "RIGHT") node.parent!.right = node.right;
    if (dir == "LEFT") node.parent!.left = node.right;
    if (!dir) this.root = node.right;
    node.right.parent = node.parent;

    node.right = node.right.left;
    if (node.right) node.right.parent = node;

    initialRightChild.left = node;
    node.parent = initialRightChild;
  }

  private bstInsert(node: AVLTreeNode) {
    let root = this.root;
    if (!root) return null;

    while (1) {
      if (root.value > node.value) {
        if (!root.left) {
          root.left = node;
          node.parent = root;
          return true;
        } else {
          root = root.left;
        }
      } else if (root.value < node.value) {
        if (!root.right) {
          root.right = node;
          node.parent = root;
          return true;
        } else {
          root = root.right;
        }
      } else {
        return false;
      }
    }
  }

  private fixInsert(newNode: AVLTreeNode | null) {
    if (!newNode) return;

    const parent = newNode.parent;
    const grandParent = parent?.parent;

    if (!parent || !grandParent) return;

    const dir = newNode.getDir()!;
    const parentDir = parent.getDir()!;
    const greatGrandParent = grandParent.parent;

    if (Math.abs(grandParent.balanceFactor()) > 1) {
      if (dir == "LEFT" && parentDir == "LEFT") {
        this.rotateLeft(grandParent);
      }

      if (dir == "RIGHT" && parentDir == "RIGHT") {
        this.rotateRight(grandParent);
      }

      if (dir == "LEFT" && parentDir == "RIGHT") {
        this.rotateLeft(parent);
        this.rotateRight(grandParent);
      }

      if (dir == "RIGHT" && parentDir == "LEFT") {
        this.rotateRight(parent);
        this.rotateLeft(grandParent);
      }

      this.fixInsert(greatGrandParent);
    } else {
      this.fixInsert(parent);
    }
  }

  insert(value: number) {
    if (this.find(value)) return;

    const newNode = new AVLTreeNode(value);

    if (!this.root) {
      this.root = newNode;
      return;
    }

    this.bstInsert(newNode);
    this.fixInsert(newNode);
  }

  delete(value: number) {
    const node = this.find(value);

    if (!node) return;

    console.log("to be implemented");
  }

  find(value: number) {
    let node = this.root;

    while (node) {
      if (value > node.value) node = node.right;
      else if (value < node.value) node = node.left;
      else return node;
    }

    return null;
  }

  inorderTraversal() {
    if (this.root) this.root.inorder();
    console.log();
  }

  print() {
    console.log("AVL TREE:");
    this.root?.print();
  }
}
