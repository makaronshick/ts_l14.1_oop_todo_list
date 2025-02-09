type TodoStatus = 'pending' | 'completed';

class TodoItem {
  private static idCounter = 0;
  readonly id: number;
  title: string;
  content: string;
  readonly createdAt: Date;
  updatedAt: Date;
  status: TodoStatus;

  constructor(title: string, content: string) {
    this.validateNotEmpty(title, content);

    this.id = TodoItem.idCounter++;
    this.title = title;
    this.content = content;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.status = 'pending';
  }

  edit(title: string, content: string): void {
    this.validateNotEmpty(title, content);

    this.title = title;
    this.content = content;
    this.updatedAt = new Date();
  }

  toggleStatus(): void {
    this.status = this.status === 'pending' ? 'completed' : 'pending';
  }

  getInfo(): string {
    return `ID: ${this.id}, Title: ${this.title}, Status: ${this.status}, Created: ${this.createdAt.toLocaleString()}, Edited: ${this.updatedAt.toLocaleString()}`;
  }

  private validateNotEmpty(title: string, content: string): void|never {
    if (!title.trim() || !content.trim()) {
      throw new Error('Title and content cannot be empty');
    }
  }
}


class ConfirmedTodoItem extends TodoItem {
  confirmEditAction(action: string): boolean {
    // return confirm(`Are you shure to ${action} this item?`); // stub method
    return true;
  }

  confirmDeleteAction(action: string): boolean {
    // return confirm(`Are you shure to ${action} this item?`); // stub method
    return true;
  }

  override edit(title: string, content: string): void {
    if (this.confirmEditAction('edit')) {
      super.edit(title, content);
    }
  }

  canBeDeleted(): boolean {
    return this.confirmDeleteAction('delete');
  }
}


class TodoList {
  private items: TodoItem[] = [];

  add(item: TodoItem): void {
    this.items.push(item);
  }

  remove(id: number): void {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      const item = this.items[index];
      if (item instanceof ConfirmedTodoItem && !item.canBeDeleted()) {
        return;
      }
      this.items.splice(index, 1);
    } else {
      console.warn(`Item with ID ${id} not found`);
    }
  }

  getAll(): TodoItem[] {
    return this.items;
  }

  getStats(): { total: number; pending: number; completed: number } {
    const pending = this.items.filter(item => item.status === 'pending').length;
    const completed = this.items.length - pending;
    return { total: this.items.length, pending, completed };
  }

  search(query: string): TodoItem[] {
    const lowerQuery = query.toLowerCase();
    return this.items.filter(
      item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.content.toLowerCase().includes(lowerQuery)
    );
  }

  sortByStatus(): TodoItem[] {
    return [...this.items].sort((a, b) =>
      a.status.localeCompare(b.status)
    );
  }

  sortByCreationDate(): TodoItem[] {
    return [...this.items].sort((a, b) =>
      a.createdAt.getTime() - b.createdAt.getTime()
    );
  }
}

//Примеры использования
const todoList = new TodoList();

const task1 = new TodoItem('Buy products', 'Bread, milk, cheese');
const task2 = new ConfirmedTodoItem('Prepare the report', 'Financial report for the month');
const task3 = new TodoItem('Do home work', 'Type script lesson 14');

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

console.log('All items:', todoList.getAll().map(item => item.getInfo()));
