import { Colors, RNode } from "./redBlackTreeNode";

export class RedBlackTree {
  root: RNode | null;

  constructor() {
    this.root = null;
  }

  private rotateLeft(node: RNode) {
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

  private rotateRight(node: RNode) {
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

  private bstInsert(node: RNode) {
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

  private handleInsertionBlackUncle(newNode: RNode) {
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

  private handleInsertionRedUncle(newNode: RNode) {
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
    if (uncle.isRed()) this.handleInsertionRedUncle(newNode);
  }

  private removeDoubleBlack(node: RNode) {
    const dir = node.getDir();
    const sibling = node.sibling();
    const parent = node.parent;

    if (!sibling) {
      throw new Error("Double black node has no sibling");
    }

    // DB is root (terminates)
    if (this.root == node || !parent) {
      console.log("DB is root (terminates)");

      node.color = Colors.BLACK;
      return;
    }

    // DB's sibling is black and sibling's chidren black
    if (
      sibling.isBlack() &&
      (!sibling.left || sibling.left.isBlack() || sibling.left.isNull) &&
      (!sibling.right || sibling.right.isBlack() || sibling.right.isNull)
    ) {
      node.removeDoubleBlack();

      // If parent is red (make it black) (terminates)
      if (parent.isRed()) {
        parent.color = Colors.BLACK;
      }
      // If parent is black (make it doubleblack) (non-terminating)
      else {
        parent.color = Colors.DOUBLE_BLACK;
        this.removeDoubleBlack(parent);
      }

      sibling.color = Colors.RED;
      return;
    }

    // DB's sibling is red
    // recolor sibling & parent and rotate in direction of DB
    if (sibling.isRed()) {
      console.log("DBs sibling is red");
      sibling.recolor();
      parent.recolor();

      if (dir == "LEFT") {
        this.rotateLeft(parent);
      } else {
        this.rotateRight(parent);
      }

      this.removeDoubleBlack(node);
    }

    // DB's sibling is black and near nephew is red and far nephew black
    if (
      sibling.isBlack() &&
      node.nearNephew()?.isRed() &&
      (!node.farNephew() || node.farNephew()?.isBlack)
    ) {
      console.log(
        "sibling is black and near nephew is red and far nephew black"
      );
      // Swap colors of sibling and nearNephew
      sibling.color = Colors.RED;
      node.nearNephew()!.color = Colors.BLACK;

      // Rotate sibling away from DB
      if (dir == "LEFT") {
        this.rotateRight(sibling);
      }
      if (dir == "RIGHT") {
        this.rotateLeft(sibling);
      }

      this.removeDoubleBlack(node);
      return;
    }

    // DB's sibling is black and far nephew is red
    if (sibling.isBlack() && node.farNephew()?.isRed()) {
      // Swap color of parent and sibling
      if (parent.isRed()) {
        sibling.color = Colors.RED;
        parent.color = Colors.BLACK;
      }

      node.farNephew()!.color = Colors.BLACK;
      if (node.nearNephew()) node.nearNephew()!.color = Colors.BLACK;

      // Rotate parent towards DB
      if (dir == "LEFT") {
        this.rotateRight(parent);
      }
      if (dir == "RIGHT") {
        this.rotateLeft(parent);
      }

      node.removeDoubleBlack();
    }
  }

  private deleteNode(node: RNode) {
    // If node is leaf node
    if (!node.left && !node.right) {
      // Terminating condition
      if (node.isRed()) {
        node.deleteSelf();
      } else {
        node.isNull = true;
        node.color = Colors.DOUBLE_BLACK;
        this.removeDoubleBlack(node);
      }
      return;
    }

    // If node only has left child
    if (!node.right && node.left) {
      console.log("only left");

      node.value = node.left.value;
      this.deleteNode(node.left);
      return;
    }

    // If node only has right child
    if (node.right && !node.left) {
      console.log("only right");

      node.value = node.right.value;
      this.deleteNode(node.right);
      return;
    }

    // If node has both children
    if (node.left && node.right) {
      const succesor = node.inorderSuccessor() as RNode;
      node.value = succesor.value;

      this.deleteNode(succesor);
      return;
    }
  }

  delete(value: number) {
    const node = this.find(value);

    if (!node) return;

    this.deleteNode(node);
  }

  find(value: number) {
    if (!this.root) return null;

    let node: RNode | null = this.root;

    while (node) {
      if (value > node.value) node = node.right;
      else if (value < node.value) node = node.left;
      else return node;
    }

    return null;
  }

  insert(value: number) {
    const newNode = new RNode(value);

    // If tree is empty color balck && return
    if (!this.root) {
      newNode.color = Colors.BLACK;
      this.root = newNode;
      return;
    }

    // Insert element (if Element already exists return)
    if (!this.bstInsert(newNode)) return;

    this.checkAndResolveConflicts(newNode);
  }

  inorderTraversal() {
    if (this.root) this.root.inorder();
    console.log();
  }

  print() {
    console.log("RED BLACK TREE:");
    this.root?.print();
  }

  toString() {
    if (!this.root) return "";

    const count: Record<number, number> = {};
    const spacing = "    ";
    const visited = new Set<number>();
    let ans = "";
    let depth = 0;
    let node = this.root;

    while (true) {
      if (node.right && !visited.has(node.right.value)) {
        node = node.right;
        depth++;
        continue;
      }

      if (!visited.has(node.value)) {
        for (let i = 0; i < depth; i++) {
          ans += i && count[i] % 2 ? "|" : " ";
          ans += spacing;
        }
        if (!count[depth]) count[depth] = 0;
        if (node.getDir() == "RIGHT") count[depth]++;
        else count[depth]--
        visited.add(node.value);
        ans += node + "\n";
      }

      if (node.left && !visited.has(node.left.value)) {
        node = node.left;
        depth++;
        continue;
      }

      if (node.parent) {
        node = node.parent;
        depth--;
        continue;
      }
      break;
    }

    return ans;
  }
}
