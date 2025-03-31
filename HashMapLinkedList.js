import LinkedListNode from "./LinkedListNode.js";

export default class HashMapLinkedList {
  constructor() {
    this._head = new LinkedListNode();
    this._tail = this._head;
    this._size = 0;
  }

  append(value) {
    const node = new LinkedListNode(value);
    this._tail.next = node;
    this._tail = node;
    this._size++;
  }

  prepend(value) {
    const node = new LinkedListNode(value);
    node.next = this._head.next;
    this._head.next = node;
    this._size++;
  }

  size() {
    return this._size;
  }

  findKey(key) {
    let curr = this._head.next;
    let i = 0;

    while (curr) {
      if (curr.value.key === key) {
        return curr;
      }

      curr = curr.next;
      i++;
    }

    return null;
  }

  isEmpty() {
    return this._size === 0;
  }

  toString() {
    let output = "";
    let curr = this._head.next;

    while (curr) {
      output += `${output !== "" ? " -> " : ""}( ${curr.value} )`;
      curr = curr.next;
    }

    output += `${output !== "" ? " -> " : ""}null`;

    return output;
  }

  removeKey(key) {
    let prev = this._head;
    let curr = prev.next;

    while (curr && curr.value.key !== key) {
      prev = curr;
      curr = curr.next;
    }

    if (curr) {
      prev.next = curr.next;
    } else {
      prev.next = curr;
    }

    return curr;
  }

  toArray() {
    const array = [];
    let curr = this._head.next;

    while (curr) {
      array.push(curr.value);
      curr = curr.next;
    }

    return array;
  }
}
