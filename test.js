import HashMap from "./HashMap.js";

const test = new HashMap();

test.set("apple", "red");
test.set("banana", "yellow");
test.set("carrot", "orange");
test.set("dog", "brown");
test.set("elephant", "gray");
test.set("frog", "green");
test.set("grape", "purple");
test.set("hat", "black");
test.set("ice cream", "white");
test.set("jacket", "blue");
test.set("kite", "pink");
test.set("lion", "golden");
console.log("entries: ", test.entries());
test.set("overload 1", "golden");
test.set("overload 2", "golden");
test.set("overload 3", "golden");

console.log("entries: ", test.entries());
console.log("keys: ", test.keys());
console.log("values: ", test.values());
console.log("length: ", test.length());
console.log("has apple: ", test.has("apple"));
console.log("get apple: ", test.get("apple"));
console.log("remove apple: ", test.remove("apple"));
console.log("get lion: ", test.get("lion"));
test.set("lion", "silver");
console.log("get updated lion: ", test.get("lion"));
console.log("keys: ", test.keys());
console.log("length: ", test.length());
console.log("has nonexistent: ", test.has("nonexistent"));
console.log("get nonexistent: ", test.get("nonexistent"));
console.log("remove nonexistent: ", test.remove("nonexistent"));
console.log("keys: ", test.keys());
console.log("length: ", test.length());

test.clear();

console.log("length: ", test.length());
