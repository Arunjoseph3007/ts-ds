export class BinomialHeapNode {
  order: number;
  value: number;
  brother: BinomialHeapNode | null;
  child: BinomialHeapNode | null;
  parent: BinomialHeapNode | null;

  constructor(value: number) {
    this.order = 0;
    this.value = value;
    this.brother = null;
    this.child = null;
    this.parent = null;
  }
}
