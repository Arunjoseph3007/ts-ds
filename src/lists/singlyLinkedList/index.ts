import { SinglyLinkedList } from "./linkedList";

const ll = new SinglyLinkedList();

console.log(ll.get(0));

ll.add(1);
ll.add(2);
ll.add(3);
ll.add(4);
ll.add(5);
ll.add(6);

ll.print();

ll.delete(ll.getSize()-1);

ll.print();
