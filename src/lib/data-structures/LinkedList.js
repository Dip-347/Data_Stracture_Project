class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    insertHead(data) {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head = newNode;
        }
        this.size++;
    }

    insertTail(data) {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.size++;
    }

    insertAt(index, data) {
        if (index < 0 || index > this.size) {
            throw new Error('Index out of bounds');
        }

        if (index === 0) {
            this.insertHead(data);
            return;
        }

        if (index === this.size) {
            this.insertTail(data);
            return;
        }

        const newNode = new Node(data);
        let current = this.head;
        let previous = null;
        let count = 0;

        while (count < index) {
            previous = current;
            current = current.next;
            count++;
        }

        newNode.next = current;
        previous.next = newNode;
        this.size++;
    }

    deleteNode(predicate) {
        if (!this.head) return null;

        if (predicate(this.head.data)) {
            const deletedData = this.head.data;
            this.head = this.head.next;
            if (!this.head) {
                this.tail = null; // List became empty
            }
            this.size--;
            return deletedData;
        }

        let current = this.head;
        let previous = null;

        while (current && !predicate(current.data)) {
            previous = current;
            current = current.next;
        }

        if (!current) {
            return null; // Not found
        }

        const deletedData = current.data;
        previous.next = current.next;

        if (!previous.next) {
            this.tail = previous; // Tail was deleted
        }

        this.size--;
        return deletedData;
    }
    
    deleteById(id) {
        return this.deleteNode(data => data.$id === id || data.id === id);
    }

    search(predicate) {
        let current = this.head;
        while (current) {
            if (predicate(current.data)) {
                return current.data;
            }
            current = current.next;
        }
        return null;
    }
    
    updateById(id, newData) {
        let current = this.head;
        while (current) {
            if (current.data.$id === id || current.data.id === id) {
                current.data = { ...current.data, ...newData };
                return current.data;
            }
            current = current.next;
        }
        return null;
    }
    
    searchAll(predicate) {
        let current = this.head;
        const results = [];
        while (current) {
            if (predicate(current.data)) {
                results.push(current.data);
            }
            current = current.next;
        }
        return results;
    }

    getSize() {
        return this.size;
    }

    getAll() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        return result;
    }
    
    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
}

export { Node, LinkedList };
export default LinkedList;
