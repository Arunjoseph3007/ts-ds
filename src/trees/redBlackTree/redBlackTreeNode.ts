export enum Colors {
  RED,
  BLACK,
  DOUBLE_BLACK,
}

export class RNode {
  value: number;
  left: null | RNode;
  right: null | RNode;
  parent: null | RNode;
  color: Colors;
  isNull: boolean;

  constructor(value: number) {
    this.left = null;
    this.right = null;
    this.parent = null;
    this.value = value;
    this.color = Colors.RED;
    this.isNull = false;
  }

  isRed() {
    return this.color == Colors.RED;
  }

  isBlack() {
    return this.color == Colors.BLACK;
  }

  isDoubleBlack() {
    return this.color == Colors.DOUBLE_BLACK;
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

  recolor() {
    if (this.isRed()) {
      this.color = Colors.BLACK;
    } else {
      this.color = Colors.RED;
    }
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

  removeDoubleBlack() {
    if (this.isNull) {
      this.deleteSelf();
    } else {
      this.color = Colors.BLACK;
    }
  }

  toString() {
    return (
      COLORS.reset +
      COLORS.fg.white +
      (this.isRed() ? COLORS.bg.red : COLORS.bg.black) +
      " " +
      (this.isNull ? "N" : this.value) +
      " " +
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
}

const COLORS = {
  reset: "\x1b[0m",
  bg: {
    red: "\x1b[41m",
    black: "\x1b[40m",
  },
  fg: {
    white: "\x1b[37m",
  },
} as const;
