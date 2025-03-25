Object.defineProperty(global, 'chrome', {
  value: {
    storage: {
      local: {
        get: jest.fn()
      }
    }
  }
});

global.fetch = jest.fn();
