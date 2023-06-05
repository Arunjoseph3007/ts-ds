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

  private merge(heap: BinomialHeap) {
    if (heap.isEmpty()) return this;
    if (this.isEmpty()) {
      this.root = heap.root;
      return this;
    }

    this.pseudoRoot = this.mergeRoot(heap).pseudoRoot;
    return this;
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
