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

  getWidth() {
    if (this.order == 0) return 1;
    return 2 ** (this.order - 1);
  }

  decrease(value: number) {
    this.value = value;
    this.minHeapify();
  }
  
  private minHeapify() {
    if (this.parent && this.value < this.parent.value) {
      [this.value, this.parent.value] = [this.parent.value, this.value];
      this.parent.minHeapify();
    }
  }

  toString() {
    let res = "";
    for (let i = 0; i < (this.order + 1) * 5 - 3; i++) res += " ";
    return res + this.value;
  }
}
