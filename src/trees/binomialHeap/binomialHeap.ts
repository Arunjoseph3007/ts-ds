import { BinomialHeapNode } from "./binomialHeapNode";

interface TPseudoRoot {
  brother: BinomialHeapNode | null;
}

export class BinomialHeap {
  pseudoRoot: TPseudoRoot;

  constructor() {
    this.pseudoRoot = { brother: null };
  }

  get root() {
    return this.pseudoRoot.brother;
  }

  set root(heap) {
    this.pseudoRoot = { brother: heap };

    let walk = this.root;
    while (walk) {
      walk.parent = null;
      walk = walk.brother;
    }
  }

  isEmpty() {
    return this.root == null;
  }

  getRootList(): number[] {
    const values: number[] = [];
    if (this.isEmpty()) return values;

    let node = this.root!;
    while (node.brother) {
      values.push(node.value);
      node = node.brother;
    }

    return values;
  }

  getMin(): null | number {
    if (this.isEmpty()) return null;

    return Math.min(...this.getRootList());
  }

  insert(value: number) {
    if (this.isEmpty()) {
      this.root = new BinomialHeapNode(value);
      return;
    }

    const newHeap = new BinomialHeap();
    newHeap.insert(value);

    this.merge(newHeap);
  }

  decrease(node: BinomialHeapNode, to: number) {
    node.decrease(to);
  }

  extractMin() {
    if (this.isEmpty()) return null;

    let walk = this.root;
    let min = this.root!;
    let prev = this.pseudoRoot;
    let minPrev = this.pseudoRoot;

    while (walk) {
      if (walk.value < min.value) {
        minPrev = prev;
        min = walk;
      }
      prev = walk;
      walk = walk.brother;
    }

    minPrev.brother = min.brother;
    // const newHeap = this.reverse(min.child);
    const newHeap = new BinomialHeap();
    newHeap.root = min.child;
    newHeap.reverseSelf();
    // newHeap.root!.parent = null;

    this.merge(newHeap);
  }

  delete(node: BinomialHeapNode) {
    this.decrease(node, -Infinity);
    this.extractMin();
  }

  merge(heap: BinomialHeap) {
    if (heap.isEmpty()) return this;
    if (this.isEmpty()) {
      this.root = heap.root;
      return this;
    }

    this.pseudoRoot = this.mergeRoot(heap).pseudoRoot;
    return this;
  }

  toString() {
    if (this.isEmpty()) return "";
    let res = "";

    let queue: Array<BinomialHeapNode | null> = [this.root];

    while (queue.filter(Boolean).length != 0) {
      const newQueue: Array<BinomialHeapNode | null> = [];

      queue.forEach((elm) => {
        let n = elm;
        while (n) {
          res += n;
          newQueue.push(n?.child || null);
          n = n.brother;
        }
      });

      queue = newQueue;
      res += "\n";
    }

    return res;
  }

  reverse(node: BinomialHeapNode | null) {
    const stack: BinomialHeapNode[] = [];
    let walk = node;

    while (walk) {
      stack.push(walk);
      walk = walk.brother;
    }

    const newHeap = new BinomialHeap();
    let reverseWalk = newHeap.pseudoRoot;

    while (stack.length != 0) {
      reverseWalk.brother = stack.pop()!;
      reverseWalk = reverseWalk.brother;
    }
    reverseWalk.brother = null;

    return newHeap;
  }

  reverseSelf() {
    const stack: BinomialHeapNode[] = [];
    let walk = this.root;

    while (walk) {
      stack.push(walk);
      walk = walk.brother;
    }

    const newHeap = new BinomialHeap();
    let reverseWalk = newHeap.pseudoRoot;

    while (stack.length != 0) {
      reverseWalk.brother = stack.pop()!;
      reverseWalk = reverseWalk.brother;
    }
    reverseWalk.brother = null;

    this.root = newHeap.root;
  }

  private mergeRoot(heap: BinomialHeap): BinomialHeap {
    let pointerA = this.pseudoRoot!;
    let pointerB = heap.pseudoRoot!;
    const mergedHeap = new BinomialHeap();
    let p: TPseudoRoot = mergedHeap.pseudoRoot;

    while (pointerA.brother && pointerB.brother) {
      if (pointerA.brother.order <= pointerB.brother.order) {
        p.brother = pointerA.brother;
        pointerA.brother = pointerA.brother.brother;
      } else {
        p.brother = pointerB.brother;
        pointerB.brother = pointerB.brother.brother;
      }
      p = p.brother;
    }

    while (pointerA.brother) {
      p.brother = pointerA.brother;
      pointerA.brother = pointerA.brother.brother;
      p = p.brother;
    }
    while (pointerB.brother) {
      p.brother = pointerB.brother;
      pointerB.brother = pointerB.brother.brother;
      p = p.brother;
    }

    return this.fixMerge(mergedHeap);
  }

  private fixMerge(mergedHeap: BinomialHeap) {
    let prev = mergedHeap.pseudoRoot;
    let pointer = mergedHeap.root!;

    while (pointer.brother) {
      if (
        pointer.order == pointer.brother.order &&
        (pointer.brother.brother == null ||
          pointer.order != pointer.brother.brother.order)
      ) {
        if (pointer.value < pointer.brother.value) {
          pointer.order++;
          const brother = pointer.brother;
          pointer.brother = brother.brother;
          brother.brother = pointer.child;
          brother.parent = pointer;
          pointer.child = brother;
        } else {
          const brother = pointer.brother;
          brother.order++;
          prev.brother = brother;
          pointer.brother = brother.child;
          brother.child = pointer;
          pointer.parent = brother;
          pointer = brother;
        }
      } else {
        prev = pointer;
        pointer = pointer.brother;
      }
    }

    return mergedHeap;
  }
}
