import { BTree } from "./bTree";

describe("Basic tests", () => {
  let bTree: BTree;

  beforeAll(() => {
    bTree = new BTree(4);
  });

  it("should be defined", () => {
    expect(bTree).toBeDefined();
  });

  it("should have order 4", () => {
    expect(bTree.order).toBe(4);
  });
});
