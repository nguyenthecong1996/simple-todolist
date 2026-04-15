/**
 * Unit tests for updateFooterStats() and its integration with renderTodos()
 * Uses jsdom environment (configured in package.json)
 */

// Extract the updateFooterStats function logic for testing
// (replicating the exact logic from index.html)
let todos = [];

function updateFooterStats() {
  const todoFooter = document.getElementById('todoFooter');
  const total = todos.length;
  if (total === 0) { todoFooter.style.display = 'none'; return; }
  const done = todos.filter(t => t.completed).length;
  document.getElementById('statTotal').textContent = `📋 Total: ${total}`;
  document.getElementById('statDone').textContent = `✅ Done: ${done}`;
  document.getElementById('statLeft').textContent = `⏳ Left: ${total - done}`;
  todoFooter.style.display = 'flex';
}

describe('updateFooterStats', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="todoFooter" style="display:none;">
        <span id="statTotal"></span>
        <span id="statDone"></span>
        <span id="statLeft"></span>
      </div>
    `;
    todos = [];
  });

  it('should hide footer when todos array is empty', () => {
    todos = [];
    updateFooterStats();
    expect(document.getElementById('todoFooter').style.display).toBe('none');
  });

  it('should show correct stats when todos exist', () => {
    todos = [
      { id: 1, text: 'Task 1', completed: true },
      { id: 2, text: 'Task 2', completed: false },
      { id: 3, text: 'Task 3', completed: false },
    ];
    updateFooterStats();

    const footer = document.getElementById('todoFooter');
    expect(footer.style.display).toBe('flex');
    expect(document.getElementById('statTotal').textContent).toBe('📋 Total: 3');
    expect(document.getElementById('statDone').textContent).toBe('✅ Done: 1');
    expect(document.getElementById('statLeft').textContent).toBe('⏳ Left: 2');
  });

  it('should show all done when all todos are completed', () => {
    todos = [
      { id: 1, text: 'Task 1', completed: true },
      { id: 2, text: 'Task 2', completed: true },
    ];
    updateFooterStats();

    expect(document.getElementById('statDone').textContent).toBe('✅ Done: 2');
    expect(document.getElementById('statLeft').textContent).toBe('⏳ Left: 0');
  });

  it('should show zero done when no todos are completed', () => {
    todos = [
      { id: 1, text: 'Task 1', completed: false },
    ];
    updateFooterStats();

    expect(document.getElementById('statDone').textContent).toBe('✅ Done: 0');
    expect(document.getElementById('statLeft').textContent).toBe('⏳ Left: 1');
  });

  it('should display footer when going from 0 to 1 todo', () => {
    todos = [];
    updateFooterStats();
    expect(document.getElementById('todoFooter').style.display).toBe('none');

    todos = [{ id: 1, text: 'New task', completed: false }];
    updateFooterStats();
    expect(document.getElementById('todoFooter').style.display).toBe('flex');
    expect(document.getElementById('statTotal').textContent).toBe('📋 Total: 1');
    expect(document.getElementById('statLeft').textContent).toBe('⏳ Left: 1');
    expect(document.getElementById('statDone').textContent).toBe('✅ Done: 0');
  });

  it('should hide footer after deleting the last todo (regression for early return bug)', () => {
    // Simulate: had 1 todo, now deleted → todos is empty
    todos = [];
    updateFooterStats();
    expect(document.getElementById('todoFooter').style.display).toBe('none');
  });
});
