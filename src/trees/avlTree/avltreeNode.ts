import { COLORS } from "../../utils/colors";

export class AVLTreeNode {
  value: number;
  left: null | AVLTreeNode;
  right: null | AVLTreeNode;
  parent: null | AVLTreeNode;

  constructor(value: number) {
    this.left = null;
    this.right = null;
    this.parent = null;
    this.value = value;
  }

  deleteSelf() {
    const dir = this.getDir();
    if (dir == "LEFT" && this.parent) this.parent.left = null;
    if (dir == "RIGHT" && this.parent) this.parent.right = null;
  }

  getDir() {
    if (!this.parent) return null;
    if (this.parent.right == this) return "RIGHT";
    if (this.parent.left == this) return "LEFT";
    return null;
  }

  uncle() {
    const grandParent = this.parent?.parent;
    if (!grandParent) return null;
    if (grandParent.left == this.parent) return grandParent.right;
    else return grandParent.left;
  }

  grandParent() {
    return this.parent?.parent || null;
  }

  sibling() {
    const dir = this.getDir();
    if (dir == "LEFT") return this.parent?.right || null;
    if (dir == "RIGHT") return this.parent?.left || null;
    return null;
  }

  inorderSuccessor() {
    if (!this.right) return null;

    let succ = this.right;
    while (1) {
      if (!succ.left) return succ;
      succ = succ.left;
    }
  }

  inorder() {
    this.left?.inorder();
    process.stdout.write(this.toString());
    this.right?.inorder();
  }

  farNephew() {
    const sibling = this.sibling();
    const dir = this.getDir();

    if (!sibling || !dir) return null;

    if (dir == "LEFT") {
      return sibling.right;
    } else {
      return sibling.left;
    }
  }

  nearNephew() {
    const sibling = this.sibling();
    const dir = this.getDir();

    if (!sibling || !dir) return null;

    if (dir == "LEFT") {
      return sibling.left;
    } else {
      return sibling.right;
    }
  }

  toString() {
    const bf = this.balanceFactor();
    return (
      COLORS.reset +
      COLORS.fg.white +
      COLORS.bg.black +
      " " +
      this.value +
      COLORS.fg.white +
      "(" +
      (Math.abs(bf) >= 2 ? COLORS.fg.red : COLORS.fg.cyan) +
      bf +
      COLORS.fg.white +
      ") " +
      COLORS.reset
    );
  }

  print(level = 0) {
    if (this.right) this.right.print(level + 1);

    for (let i = 0; i < level; i++) {
      process.stdout.write("     ");
    }
    console.log(this.toString());

    if (this.left) this.left.print(level + 1);
  }

  height(): number {
    if (!this.right && !this.left) return 1;
    return Math.max(this.left?.height() ?? 0, this.right?.height() ?? 0) + 1;
  }

  balanceFactor() {
    return (this.right?.height() || 0) - (this.left?.height() || 0);
  }
}
