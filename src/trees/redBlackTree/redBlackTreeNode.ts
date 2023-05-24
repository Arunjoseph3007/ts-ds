export class RNode {
  value: number;
  left: null | RNode;
  right: null | RNode;
  parent: null | RNode;
  isRed: boolean;
  isDoubleBlack: boolean;
  isNull: boolean;

  constructor(value: number, isRed: boolean = true) {
    this.left = null;
    this.right = null;
    this.parent = null;
    this.value = value;
    this.isRed = isRed;
    this.isDoubleBlack = false;
    this.isNull = false;
  }

  deleteSelf() {
    const dir = this.getDir();
    if (dir == "LEFT" && this.parent) this.parent.left = null;
    if (dir == "RIGHT" && this.parent) this.parent.right = null;
  }

  getDir() {
    if (!this.parent) return null;
    if (this.value > this.parent.value) return "RIGHT";
    else return "LEFT";
  }

  isBlack() {
    return !this.isRed;
  }

  recolor() {
    this.isRed = !this.isRed;
    return this;
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
    console.log(`(${this.isRed ? "1" : "0"}, ${this.value})`);
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

  removeDoubleBlack() {
    if (this.isNull) this.deleteSelf();
    else this.isDoubleBlack = false;
  }

  toString() {
    return `(${this.isRed ? "1" : "0"}, ${this.value})`;
  }
}
