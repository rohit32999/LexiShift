// Mock chrome.storage API
global.chrome = {
  storage: {
    local: {
      get: jest.fn(),
    },
  },
};

// Mock fetch API
global.fetch = jest.fn();

describe('Translation functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  test('should handle successful translation', async () => {
    // Mock storage data
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({
        textToTranslate: 'hello',
        targetLanguages: ['es', 'fr']
      });
    });

    // Mock successful fetch responses
    fetch
      .mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ translatedText: 'hola' })
        })
      )
      .mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ translatedText: 'bonjour' })
        })
      );

    // Import and execute translation logic
    require('./translate.js');

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));

    // Check if modal was created with correct translations
    const modal = document.querySelector('div');
    expect(modal).toBeTruthy();
    expect(modal.innerHTML).toContain('Translated Word in es: hola');
    expect(modal.innerHTML).toContain('Translated Word in fr: bonjour');
  });

  test('should handle translation error', async () => {
    const consoleSpy = jest.spyOn(console, 'error');
    global.alert = jest.fn();

    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({
        textToTranslate: 'hello',
        targetLanguages: ['es']
      });
    });

    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve('API Error')
      })
    );

    require('./translate.js');

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(consoleSpy).toHaveBeenCalled();
    expect(global.alert).toHaveBeenCalledWith('Error: Translation failed');
  });

  test('should handle missing input data', () => {
    global.alert = jest.fn();

    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({});
    });

    require('./translate.js');

    expect(global.alert).toHaveBeenCalledWith('No word selected or target languages not set.');
  });
});
