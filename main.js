var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var TodoItem = /** @class */ (function () {
    function TodoItem(title, content) {
        this.validateNotEmpty(title, content);
        this.id = TodoItem.idCounter++;
        this.title = title;
        this.content = content;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.status = 'pending';
    }
    TodoItem.prototype.edit = function (title, content) {
        this.validateNotEmpty(title, content);
        this.title = title;
        this.content = content;
        this.updatedAt = new Date();
    };
    TodoItem.prototype.toggleStatus = function () {
        this.status = this.status === 'pending' ? 'completed' : 'pending';
    };
    TodoItem.prototype.getInfo = function () {
        return "ID: ".concat(this.id, ", Title: ").concat(this.title, ", Status: ").concat(this.status, ", Created: ").concat(this.createdAt.toLocaleString(), ", Edited: ").concat(this.updatedAt.toLocaleString());
    };
    TodoItem.prototype.validateNotEmpty = function (title, content) {
        if (!title.trim() || !content.trim()) {
            throw new Error('Title and content cannot be empty');
        }
    };
    TodoItem.idCounter = 0;
    return TodoItem;
}());
var ConfirmedTodoItem = /** @class */ (function (_super) {
    __extends(ConfirmedTodoItem, _super);
    function ConfirmedTodoItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConfirmedTodoItem.prototype.confirmEditAction = function (action) {
        // return confirm(`Are you shure to ${action} this item?`); // stub method
        return true;
    };
    ConfirmedTodoItem.prototype.confirmDeleteAction = function (action) {
        // return confirm(`Are you shure to ${action} this item?`); // stub method
        return true;
    };
    ConfirmedTodoItem.prototype.edit = function (title, content) {
        if (this.confirmEditAction('edit')) {
            _super.prototype.edit.call(this, title, content);
        }
    };
    ConfirmedTodoItem.prototype.canBeDeleted = function () {
        return this.confirmDeleteAction('delete');
    };
    return ConfirmedTodoItem;
}(TodoItem));
var TodoList = /** @class */ (function () {
    function TodoList() {
        this.items = [];
    }
    TodoList.prototype.add = function (item) {
        this.items.push(item);
    };
    TodoList.prototype.remove = function (id) {
        var index = this.items.findIndex(function (item) { return item.id === id; });
        if (index !== -1) {
            var item = this.items[index];
            if (item instanceof ConfirmedTodoItem && !item.canBeDeleted()) {
                return;
            }
            this.items.splice(index, 1);
        }
        else {
            console.warn("Item with ID ".concat(id, " not found"));
        }
    };
    TodoList.prototype.getAll = function () {
        return this.items;
    };
    TodoList.prototype.getStats = function () {
        var pending = this.items.filter(function (item) { return item.status === 'pending'; }).length;
        var completed = this.items.length - pending;
        return { total: this.items.length, pending: pending, completed: completed };
    };
    TodoList.prototype.search = function (query) {
        var lowerQuery = query.toLowerCase();
        return this.items.filter(function (item) {
            return item.title.toLowerCase().includes(lowerQuery) ||
                item.content.toLowerCase().includes(lowerQuery);
        });
    };
    TodoList.prototype.sortByStatus = function () {
        return __spreadArray([], this.items, true).sort(function (a, b) {
            return a.status.localeCompare(b.status);
        });
    };
    TodoList.prototype.sortByCreationDate = function () {
        return __spreadArray([], this.items, true).sort(function (a, b) {
            return a.createdAt.getTime() - b.createdAt.getTime();
        });
    };
    return TodoList;
}());
//Примеры использования
var todoList = new TodoList();
var task1 = new TodoItem('Buy products', 'Bread, milk, cheese');
var task2 = new ConfirmedTodoItem('Prepare the report', 'Financial report for the month');
var task3 = new TodoItem('Do home work', 'Type script lesson 14');
todoList.add(task1);
todoList.add(task2);
todoList.add(task3);
console.log('todoList: ', todoList);
task1.edit('Buy products', 'Bread, apples');
console.log('edited task1: ', task1);
task1.toggleStatus();
console.log('completed status task1: ', task1);
task3.toggleStatus();
console.log('completed status task3: ', task3);
console.log('Search by item title "the report": ', todoList.search('the report'));
console.log('Search by item content "Bread": ', todoList.search('Bread'));
console.log('Stats: ', todoList.getStats());
console.log('Sort by status: ', todoList.sortByStatus());
todoList.remove(task2.id);
console.log('todoList: ', todoList);
console.log('All items:', todoList.getAll().map(function (item) { return item.getInfo(); }));
