import { BTree } from "./bTree";

describe("Basic tests", () => {
  let bTree: BTree;

  beforeEach(() => {
    bTree = new BTree(4);
  });

  it("should be defined", () => {
    expect(bTree).toBeDefined();
  });

  it("should have null root initially", () => {
    expect(bTree.root).toBeNull();
  });

  it("should have order 4", () => {
    expect(bTree.order).toBe(4);
  });

  it("should handle insertion", () => {
    bTree.insert(10);
    expect(bTree.root).toBeDefined();
    expect(bTree.root?.keys.length).toBe(1);
    expect(bTree.root?.children.length).toBe(2);
  });

  it("should handle multiple insertions", () => {
    const inserted: number[] = [];
    for (let i = 0; i < 50; i++) {
      bTree.insert(i);
      inserted.push(i);
    }

    expect(bTree.size()).toBe(50);
    expect(bTree.root?.inOrder()).toEqual(inserted);
  });
});
