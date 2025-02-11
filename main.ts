type TodoStatus = 'pending' | 'completed';

interface ITodoItem {
  readonly id: number;
  title: string;
  content: string;
  readonly createdAt: Date;
  updatedAt: Date;
  status: TodoStatus;
  getInfo(): string;
}

class TodoItem implements ITodoItem {
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
  public confirm: boolean;

  constructor(title: string, content: string) {
    super(title, content);
    this.confirm = false;
  }

  isConfirmed(): boolean {
    return this.confirm;
  }

  override edit(title: string, content: string): void {
    if (this.isConfirmed()) {
      super.edit(title, content);
    }
  }

  canBeEdited(): boolean {
    return this.isConfirmed();
  }

  canBeDeleted(): boolean {
    return this.isConfirmed();
  }
}

class TodoList {
  private items: ITodoItem[] = [];

  add(item: ITodoItem): void {
    this.items.push(item);
  }

  edit(id: number, title: string, content: string): void {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      const item = this.items[index];
      if (item instanceof ConfirmedTodoItem && !item.canBeEdited()) {
        return;
      }
      if (item instanceof TodoItem) {
        item.edit(title, content);
      }
    } else {
      console.warn(`Item with ID ${id} not found for edit`);
    }
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
      console.warn(`Item with ID ${id} not found for delete`);
    }
  }

  getAll(): ITodoItem[] {
    return this.items;
  }

  getStats(): { total: number; pending: number; completed: number } {
    const pending = this.items.filter(item => item.status === 'pending').length;
    const completed = this.items.length - pending;
    return { total: this.items.length, pending, completed };
  }

  search(query: string): ITodoItem[] {
    const lowerQuery = query.toLowerCase();
    return this.items.filter(
      item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.content.toLowerCase().includes(lowerQuery)
    );
  }

  sortByStatus(): ITodoItem[] {
    return [...this.items].sort((a, b) =>
      a.status.localeCompare(b.status)
    );
  }

  sortByCreationDate(): ITodoItem[] {
    return [...this.items].sort((a, b) =>
      a.createdAt.getTime() - b.createdAt.getTime()
    );
  }
}

//Примеры использования
const todoList = new TodoList();

const task1 = new TodoItem('Buy products', 'Bread, milk, cheese');
const task2 = new TodoItem('Do home work', 'Type script lesson 14');
const task3 = new ConfirmedTodoItem('Prepare the report', 'Financial report for the month');
const task4 = new ConfirmedTodoItem('Open bank account', 'Need to open account in Privat Bank');

todoList.add(task1);
todoList.add(task2);
todoList.add(task3);
todoList.add(task4);
console.log('todoList: ', todoList); // 4 items

task1.edit('Buy products', 'Bread, apples'); // normal edit 
console.log('edited task1: ', task1.content);

task1.toggleStatus();
console.log('completed status task1: ', task1.status); // status "completed"

task3.edit('Prepare the report!!!', 'Financial report for the month!!!'); // skip edit without confirm
console.log('no edited task3: ', task3.content);
task3.confirm = true;
task3.edit('Prepare the report???', 'Financial report for the month???'); // normal edit with confirm
console.log('edited task3: ', task3.content);

console.log('Search by item title "the report": ', todoList.search('the report'));
console.log('Search by item content "Bread": ', todoList.search('Bread'));
console.log('Stats: ', todoList.getStats());
console.log('Sort by status: ', todoList.sortByStatus());

todoList.edit(task2.id, 'Do home work!!!', 'Vrode 4to-to polu4ilosb'); // normal edit with on ToDoList
console.log('edited task2: ', task2.content);

todoList.remove(task2.id); // normal remove
console.log('All items after remove item 2:', todoList.getAll().map(item => item.getInfo())); // 3 items

todoList.remove(task4.id); // skip remove without confirm
console.log('All items (remove item 4 skipped):', todoList.getAll().map(item => item.getInfo())); // 3 items
task4.confirm = true;
todoList.remove(task4.id); // normal remove without confirm
console.log('All items after remove item 4:', todoList.getAll().map(item => item.getInfo())); // 2 items

console.log('todoList: ', todoList); // 2 items

console.log('All items:', todoList.getAll().map(item => item.getInfo()));
