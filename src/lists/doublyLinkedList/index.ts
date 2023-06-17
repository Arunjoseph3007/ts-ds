import DoublyLinkedList from "./LinkedList";

const dll = new DoublyLinkedList();

for (let i = 0; i < 15; i++) {
  dll.append(i);
}

for (let i = 10; i < 15; i++) {
  dll.prepend(i);
}

dll.delete(5);
dll.delete(12);
dll.delete(14);
dll.delete(7);

dll.remove(4);
dll.remove(3);
dll.remove(5);
dll.remove(5);
dll.remove(0);

console.log("" + dll);

dll.insert(100, 2);
console.log("" + dll);
dll.insert(100, 4);
console.log("" + dll);
dll.insert(100, 0);
console.log("" + dll);
dll.insert(1000, dll.getSize() );
console.log("" + dll);
