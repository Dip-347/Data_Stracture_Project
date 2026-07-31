class DynamicArray {
    constructor() {
        this.data = [];
    }

    insert(item) {
        this.data.push(item);
        return this.data.length - 1; // Return the index of insertion
    }

    delete(index) {
        if (index < 0 || index >= this.data.length) {
            throw new Error('Index out of bounds');
        }
        const deletedItem = this.data[index];
        this.data.splice(index, 1);
        return deletedItem;
    }
    
    // For deleting by matching an id (often used in these projects)
    deleteById(id) {
        const index = this.data.findIndex(item => item.$id === id || item.id === id);
        if (index !== -1) {
            return this.delete(index);
        }
        return null;
    }

    get(index) {
        if (index < 0 || index >= this.data.length) {
            throw new Error('Index out of bounds');
        }
        return this.data[index];
    }

    search(predicate) {
        return this.data.find(predicate) || null;
    }
    
    searchAll(predicate) {
        return this.data.filter(predicate);
    }

    update(index, newItem) {
        if (index < 0 || index >= this.data.length) {
            throw new Error('Index out of bounds');
        }
        this.data[index] = { ...this.data[index], ...newItem };
        return this.data[index];
    }
    
    updateById(id, newItem) {
        const index = this.data.findIndex(item => item.$id === id || item.id === id);
        if (index !== -1) {
            return this.update(index, newItem);
        }
        return null;
    }

    getSize() {
        return this.data.length;
    }

    getAll() {
        return [...this.data]; // Return a copy
    }

    clear() {
        this.data = [];
    }
}

export default DynamicArray;
