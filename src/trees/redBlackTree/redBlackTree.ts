import { RNode } from "./RNode";

export class RedBlackTree {
  root: RNode | null;

  constructor() {
    this.root = null;
  }

  inorderTraversal() {
    if (this.root) this.root.inorder();
  }

  rotateLeft(node: RNode) {
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

  rotateRight(node: RNode) {
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

  bstInsert(node: RNode) {
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

  handleInsertionBlackUncle(newNode: RNode) {
    const dir = newNode.getDir();
    const parentDir = newNode.parent?.getDir();
    newNode.parent?.parent?.recolor();

    if (dir == "LEFT" && parentDir == "RIGHT") {
      newNode.recolor();
      this.rotateLeft(newNode.parent!);
      this.rotateRight(newNode.parent!);
    }

    if (dir == "RIGHT" && parentDir == "LEFT") {
      newNode.recolor();
      this.rotateRight(newNode.parent!);
      this.rotateLeft(newNode.parent!);
    }

    if (dir == "LEFT" && parentDir == "LEFT") {
      newNode.parent?.recolor();
      this.rotateLeft(newNode.parent?.parent!);
    }

    if (dir == "RIGHT" && parentDir == "RIGHT") {
      newNode.parent?.recolor();
      this.rotateRight(newNode.parent?.parent!);
    }

    return;
  }

  handleInsertionRedUncle(newNode: RNode) {
    if (!newNode.parent) return;

    newNode.parent.recolor();
    newNode.uncle()?.recolor();

    if (newNode.parent.parent != this.root) {
      newNode.parent?.parent!.recolor();
      this.checkAndResolveConflicts(newNode.parent.parent!);
    }
  }

  private checkAndResolveConflicts(newNode: RNode) {
    if (newNode == this.root || newNode.parent?.isBlack()) return;

    const uncle = newNode.uncle();

    // Uncle is Black or null
    if (!uncle || uncle.isBlack()) {
      this.handleInsertionBlackUncle(newNode);
      return;
    }

    // Uncle is Red (do suitable recoloring)
    if (uncle.isRed) this.handleInsertionRedUncle(newNode);
  }

  insert(value: number) {
    const newNode = new RNode(value);

    // If tree is empty color balck && return
    if (!this.root) {
      newNode.isRed = false;
      this.root = newNode;
      return;
    }

    // Insert element (if Element already exists return)
    if (!this.bstInsert(newNode)) return;

    this.checkAndResolveConflicts(newNode);
  }

  private findNodeWithValue(value: number) {
    if (!this.root) return null;

    let node: RNode | null = this.root;

    while (node) {
      if (value > node.value) node = node.right;
      else if (value < node.value) node = node.left;
      else return node;
    }

    return null;
  }

  private handleDoubleBlack(node: RNode) {
    const dir = node.getDir();
    const sibling = node.sibling();
    const parent = node.parent;

    // DB is root (terminates)
    if (this.root == node || !parent) {
      node.isDoubleBlack = false;
      return;
    }

    if (!sibling) {
      throw new Error("Double black node has no sibling");
    }

    // DB's sibling is black and sibling's chidren black
    if (
      sibling.isBlack() &&
      (!sibling.left || sibling.left.isBlack() || sibling.left.isNull) &&
      (!sibling.right || sibling.right.isBlack() || sibling.right.isNull)
    ) {
      node.removeDoubleBlack();
      // If parent is red (make it black) (terminates)
      if (parent.isRed) {
        parent.isRed = false;
      }
      // If parent is black (make it doubleblack) (non-terminating)
      else {
        parent.isDoubleBlack = true;
        this.handleDoubleBlack(parent);
      }

      sibling.isRed = true;
      return;
    }

    // DB's sibling is red
    // recolor sibling & parent and rotate in direction of DB
    if (sibling.isRed) {
      sibling.recolor();
      parent.recolor();

      if (dir == "LEFT") {
        this.rotateLeft(parent);
      } else {
        this.rotateRight(parent);
      }

      this.handleDoubleBlack(node);
    }

    // DB's sibling is black and near nephew is red
    if (sibling.isBlack() && node.nearNephew()?.isRed) {
    }

    // DB's sibling is black and near nephew is red
    if (sibling.isBlack() && !node.farNephew()?.isRed) {
    }
  }

  private deleteNode(node: RNode) {
    // If node is leaf node
    if (!node.left && !node.right) {
      // Terminating condition
      if (node.isRed) {
        node.deleteSelf();
      } else {
        node.isNull = true;
        node.isDoubleBlack = true;
        this.handleDoubleBlack(node);
      }
      return;
    }

    // If node only has left child
    if (!node.right && node.left) {
      node.value = node.left.value;
      this.deleteNode(node.left);
      return;
    }

    // If node only has right child
    if (node.right && !node.left) {
      node.value = node.right.value;
      this.deleteNode(node.right);
      return;
    }

    // If node has both children
    if (node.left && node.right) {
      const succesor = node.inorderSuccessor() as RNode;
      node.value == succesor.value;
      this.deleteNode(succesor);
      return;
    }
  }

  delete(value: number) {
    const node = this.findNodeWithValue(value);

    if (!node) return;

    this.deleteNode(node);
  }
}
