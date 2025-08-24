import {Environment, Network, RecordSource, Store} from 'relay-runtime';
import type {PreferencesMap} from '../shared/preferences-types';
import {getCurrentPreferences, setCookieValue} from '../shared/cookie-utils';

// Enhanced environment with context support
interface RelayEnvironmentWithContext extends Environment {
  setContext: (newContext: Partial<PreferencesMap>) => void;
  getContext: () => PreferencesMap;
  updateContextAndInvalidate: (newContext: Partial<PreferencesMap>) => void;
}

// Global context state
let environmentContext: PreferencesMap = {} as PreferencesMap;
const contextChangeListeners: Set<() => void> = new Set();

export function createClientNetwork() {
  return Network.create(async (params, variables) => {
    const currentContext = getEnvironmentContext();

    const response = await fetch('/api/graphql', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // Send structured context with preferences nested
        'X-Relay-Context': JSON.stringify({
          preferences: currentContext,
        }),
        // Legacy header for backward compatibility during migration
        'X-Preferences': JSON.stringify(currentContext),
      },
      body: JSON.stringify({
        query: params.text,
        id: params.id,
        variables: {
          ...variables,
        },
        // Pass structured context in GraphQL extensions
        extensions: {
          relayContext: {
            preferences: currentContext,
          },
        },
      }),
    });

    const json = await response.text();
    return JSON.parse(json);
  });
}

let clientEnv: RelayEnvironmentWithContext | undefined;

export function getClientEnvironment(): RelayEnvironmentWithContext | null {
  if (typeof window === 'undefined') return null;

  if (clientEnv == null) {
    // Initialize context from cookies on first load
    environmentContext = getCurrentPreferences();

    const baseEnvironment = new Environment({
      network: createClientNetwork(),
      store: new Store(new RecordSource()),
      isServer: false,
    }) as RelayEnvironmentWithContext;

    // Add context methods
    baseEnvironment.getContext = () => {
      return environmentContext;
    };

    baseEnvironment.setContext = (newContext: Partial<PreferencesMap>) => {
      const previousContext = {...environmentContext};
      environmentContext = {
        ...environmentContext,
        ...newContext,
      };

      // Notify listeners (for debugging/dev tools)
      contextChangeListeners.forEach((listener) => listener());

      console.debug('🔄 Relay context updated:', {
        previous: previousContext,
        current: environmentContext,
        changed: newContext,
      });
    };

    baseEnvironment.updateContextAndInvalidate = (
      newContext: Partial<PreferencesMap>,
    ) => {
      baseEnvironment.setContext(newContext);

      baseEnvironment.commitUpdate((store) => {
        (store as any).invalidateStore(); // hack for weird type issue with invalidateStore
      });

      console.debug('🔄 Store invalidated due to context change');
    };

    clientEnv = baseEnvironment;
  }

  return clientEnv;
}

// Utility functions for managing context
export function getEnvironmentContext(): PreferencesMap {
  return environmentContext;
}

export function updateRelayContext(newContext: Partial<PreferencesMap>) {
  const env = getClientEnvironment();
  if (env) {
    env.updateContextAndInvalidate(newContext);
  } else {
    // Fallback for server-side or before environment is ready
    environmentContext = {
      ...environmentContext,
      ...newContext,
    };
  }
}

// Clean up legacy functions
export function updateRelayPreferences(preferences: Partial<PreferencesMap>) {
  updateRelayContext(preferences);
}

export function getRelayPreferences(): Partial<PreferencesMap> {
  return getEnvironmentContext();
}

export function clearRelayContext() {
  const env = getClientEnvironment();
  if (env) {
    env.setContext({});
    env.commitUpdate((store) => {
      (store as any).invalidateStore();
    });
  } else {
    environmentContext = {} as PreferencesMap;
  }
}

export function clearRelayPreferences() {
  clearRelayContext();
}

// Development utilities
export function addContextChangeListener(listener: () => void) {
  contextChangeListeners.add(listener);
  return () => contextChangeListeners.delete(listener);
}

// Hook for React DevTools or debugging
export function useRelayContextDevTools() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).__RELAY_CONTEXT__ = {
      getContext: getEnvironmentContext,
      updateContext: updateRelayContext,
      clearContext: clearRelayContext,
      addListener: addContextChangeListener,
    };
  }
}

// ========================================
// DEBUG FUNCTIONS thanks claude.ai
// ========================================

// Debug function to test all Relay context functionality
export function debugRelayContext() {
  console.log('=== RELAY CONTEXT DEBUG ===');

  // Test 1: Current state
  console.log('1. Current Environment Context:', getEnvironmentContext());
  console.log('2. Current Cookie Preferences:', getCurrentPreferences());
  console.log('3. Client Environment exists:', !!getClientEnvironment());

  // Test 2: Context update
  console.log('\n🔄 Testing context update...');
  const testUpdate = {commanders: {sortBy: 'TEST_DEBUG' as any}};
  console.log('Updating with:', testUpdate);
  updateRelayContext(testUpdate);
  console.log('Context after update:', getEnvironmentContext());

  // Test 3: Cookie writing test
  console.log('\n🍪 Testing cookie functionality...');
  testRelayCookieWrite();

  // Test 4: Real preferences test
  console.log('\n📊 Testing real preferences write...');
  testRealPreferencesWrite();

  // Test 5: Network test simulation
  console.log('\n🌐 Testing network context...');
  const networkContext = getEnvironmentContext();
  console.log('Context that would be sent in headers:', {
    'X-Relay-Context': JSON.stringify({preferences: networkContext}),
    'X-Preferences': JSON.stringify(networkContext),
  });

  console.log('\n=== DEBUG COMPLETE ===');
}

// Test cookie writing from Relay environment
export function testRelayCookieWrite() {
  console.log('🧪 Testing cookie write from relay environment...');

  if (typeof document === 'undefined') {
    console.log('❌ No document available');
    return false;
  }

  // Test basic cookie
  const testValue = `relayTest_${Date.now()}`;
  console.log('🧪 Setting test cookie:', testValue);
  document.cookie = `relayDebugTest=${testValue}; path=/`;

  // Verify
  const success = document.cookie.includes(`relayDebugTest=${testValue}`);
  console.log('🧪 Cookie write success:', success);

  if (success) {
    console.log('✅ Cookie writing mechanism works');
  } else {
    console.log('❌ Cookie writing failed');
    console.log('Current document.cookie:', document.cookie);
  }

  return success;
}

// Test writing real preferences as cookies
export function testRealPreferencesWrite() {
  console.log('🧪 Testing real preferences cookie write...');

  if (typeof document === 'undefined') {
    console.log('❌ No document available');
    return false;
  }

  const currentContext = getEnvironmentContext();
  console.log('🧪 Current relay context:', currentContext);

  let testPreferences;

  if (Object.keys(currentContext).length === 0) {
    console.log('🧪 Context empty, using default test preferences...');
    testPreferences = {
      commanders: {
        sortBy: 'CONVERSION',
        timePeriod: 'ONE_MONTH',
        display: 'card',
        minEntries: 0,
        minTournamentSize: 0,
        colorId: '',
        statsDisplay: 'topCuts',
      },
      entry: {
        maxStanding: null,
        minEventSize: null,
        sortBy: 'TOP',
        timePeriod: 'ONE_YEAR',
      },
      tournament: {tab: 'entries', commander: null},
      tournaments: {sortBy: 'DATE', timePeriod: 'ALL_TIME', minSize: 0},
    };
  } else {
    console.log('🧪 Using current relay context as preferences...');
    testPreferences = currentContext;
  }

  const jsonToSave = JSON.stringify(testPreferences);
  console.log('🧪 JSON to save:', jsonToSave.substring(0, 200) + '...');

  const encodedValue = encodeURIComponent(jsonToSave);
  if (encodedValue.length > 4000) {
    console.log('❌ Encoded value too long:', encodedValue.length);
    return false;
  }

  const cookieString = `sitePreferences=${encodedValue}; path=/; SameSite=Lax`;
  console.log('🧪 Setting sitePreferences cookie...');

  document.cookie = cookieString;

  // Verify after short delay
  setTimeout(() => {
    const verification = document.cookie.includes('sitePreferences=');
    console.log('🧪 sitePreferences cookie exists:', verification);

    if (verification) {
      console.log('✅ Real preferences cookie write successful');

      // Try to read back
      try {
        const readBack = getCurrentPreferences();
        console.log('🧪 Read back preferences:', readBack);
        console.log('✅ Cookie read/parse successful');
      } catch (error) {
        console.log('❌ Cookie read/parse failed:', error);
      }
    } else {
      console.log('❌ Real preferences cookie write failed');
      console.log('Current cookies:', document.cookie);
    }
  }, 100);

  return true;
}

// Test context listeners
export function testContextListeners() {
  console.log('🧪 Testing context change listeners...');

  let listenerCalled = false;
  const testListener = () => {
    listenerCalled = true;
    console.log('📡 Context listener triggered!');
  };

  const removeListener = addContextChangeListener(testListener);

  console.log('🧪 Updating context to trigger listener...');
  updateRelayContext({commanders: {sortBy: 'LISTENER_TEST' as any}});

  setTimeout(() => {
    if (listenerCalled) {
      console.log('✅ Context listeners working');
    } else {
      console.log('❌ Context listeners not working');
    }

    removeListener();
    console.log('🧪 Listener removed');
  }, 100);
}

// Comprehensive debug function
export function debugRelayEnvironmentComplete() {
  console.log('=== COMPREHENSIVE RELAY DEBUG ===');

  // Environment info
  console.log('\n📋 Environment Info:');
  console.log('- Browser:', typeof window !== 'undefined');
  console.log('- Document:', typeof document !== 'undefined');
  console.log(
    '- Cookies enabled:',
    typeof navigator !== 'undefined' ? navigator.cookieEnabled : 'unknown',
  );
  console.log(
    '- Current URL:',
    typeof window !== 'undefined' ? window.location.href : 'server',
  );

  // Relay state
  console.log('\n📡 Relay State:');
  console.log('- Environment exists:', !!getClientEnvironment());
  console.log('- Environment context:', getEnvironmentContext());
  console.log('- Cookie preferences:', getCurrentPreferences());

  // Run all tests
  console.log('\n🧪 Running Tests:');
  testRelayCookieWrite();

  setTimeout(() => {
    testRealPreferencesWrite();

    setTimeout(() => {
      testContextListeners();

      console.log('\n=== COMPREHENSIVE DEBUG COMPLETE ===');
    }, 200);
  }, 200);
}

// Add to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).__debugRelay = debugRelayContext;
  (window as any).__debugRelayComplete = debugRelayEnvironmentComplete;
  (window as any).__testRelayCookies = testRelayCookieWrite;
  (window as any).__testRealPrefs = testRealPreferencesWrite;

  console.log('🔧 Relay debug functions available:');
  console.log('- window.__debugRelay()');
  console.log('- window.__debugRelayComplete()');
  console.log('- window.__testRelayCookies()');
  console.log('- window.__testRealPrefs()');
}
