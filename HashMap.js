import HashMapNode from "./HashMapNode.js";
import HashMapLinkedList from "./HashMapLinkedList.js";

export default class HashMap {
  constructor(capacity = 16, loadfactor = 0.75) {
    this.capacity = capacity;
    this.loadfactor = loadfactor;
    this.buckets = new Array(capacity);
    this.totalEntries = 0;
  }

  hash(key) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
    }

    return hashCode;
  }

  set(key, value) {
    const keyHash = this.hash(key);
    const bucket = this.ensureBucket(keyHash);
    let node = bucket.findKey(key);

    if (node) {
      node.value.value = value;
      return;
    }

    node = new HashMapNode(key, value);
    bucket.append(node);
    this.totalEntries++;

    if (this.totalEntries > this.capacity * this.loadfactor) {
      this.grow();
    }
  }

  ensureBucket(index) {
    if (!this.buckets[index]) {
      this.buckets[index] = new HashMapLinkedList();
    }

    return this.buckets[index];
  }

  get(key) {
    const keyHash = this.hash(key);
    const bucket = this.buckets[keyHash];
    const node = bucket && bucket.findKey(key);

    return node ? node.value.value : null;
  }

  has(key) {
    return this.get(key) !== null;
  }

  remove(key) {
    const keyHash = this.hash(key);
    const bucket = this.buckets[keyHash];

    if (bucket && bucket.removeKey(key)) {
      this.totalEntries--;
      return true;
    }

    return false;
  }

  length() {
    return this.totalEntries;
  }

  clear() {
    Object.assign(this, new HashMap());
  }

  entries() {
    const arr = [];

    this.buckets.forEach((bucket) => {
      if (bucket) {
        arr.push(
          ...bucket.toArray().map((node) => {
            return { key: node.key, value: node.value };
          })
        );
      }
    });

    return arr;
  }

  keys() {
    return this.entries().map((entry) => entry.key);
  }

  values() {
    return this.entries().map((entry) => entry.value);
  }

  grow() {
    const entries = this.entries();
    this.totalEntries = 0;
    this.capacity *= 2;
    this.buckets = new Array(this.capacity);

    entries.forEach((entry) => this.set(entry.key, entry.value));
  }
}
