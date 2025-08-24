import {Context} from './schema/builder';
import {TopdeckClient} from './topdeck';
import type {PreferencesMap} from '../shared/preferences-types';
import {getPreferencesFromRequest} from './cookies';
import {DEFAULT_PREFERENCES} from '../shared/preferences-types';

export function createContext(
  request?: Request,
  preferences?: Partial<PreferencesMap>,
): Context {
  let relayContext: PreferencesMap = {};
  
  // Multi-source context extraction with priority order:
  // 1. Explicit preferences parameter (highest priority)
  // 2. X-Relay-Context header (new approach)  
  // 3. X-Preferences header (legacy)
  // 4. Request cookies/body (fallback)
  // 5. Default preferences (last resort)
  
  if (preferences && Object.keys(preferences).length > 0) {
    // Use explicitly passed preferences
    relayContext = {
      ...DEFAULT_PREFERENCES,
      ...preferences,
    };
    console.debug('📊 Relay Context from explicit preferences:', relayContext);
  } else if (request) {
    try {
      // Check for new Relay context header first
      const relayContextHeader = request.headers.get('X-Relay-Context');
      if (relayContextHeader) {
        relayContext = {
          ...DEFAULT_PREFERENCES,
          ...JSON.parse(relayContextHeader),
        };
        console.debug('📊 Relay Context from X-Relay-Context header:', relayContext);
      } else {
        // Check legacy preferences header
        const prefsHeader = request.headers.get('X-Preferences');
        if (prefsHeader) {
          relayContext = {
            ...DEFAULT_PREFERENCES,
            ...JSON.parse(prefsHeader),
          };
          console.debug('📊 Relay Context from X-Preferences header (legacy):', relayContext);
        } else {
          // Fallback to cookies/request parsing
          relayContext = {
            ...DEFAULT_PREFERENCES,
            ...getPreferencesFromRequest(request),
          };
          console.debug('📊 Relay Context from request (cookies):', relayContext);
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to parse relay context from request:', error);
      relayContext = DEFAULT_PREFERENCES;
    }
  } else {
    // No request provided, use defaults
    relayContext = DEFAULT_PREFERENCES;
    console.debug('📊 Relay Context using defaults (no request)');
  }

  return {
    topdeckClient: new TopdeckClient(),
    preferences: relayContext, // This maintains backward compatibility
    relayContext, // New explicit property for clarity
    request,
  };
}

// Enhanced function for use specifically with GraphQL context extraction
export function createRelayContext(
  request: Request,
  graphqlParams?: { extensions?: { relayContext?: Partial<PreferencesMap> } }
): Context {
  let relayContext: PreferencesMap = {};
  
  try {
    // Priority 1: GraphQL extensions (from client environment)
    if (graphqlParams?.extensions?.relayContext) {
      relayContext = {
        ...DEFAULT_PREFERENCES,
        ...graphqlParams.extensions.relayContext,
      };
      console.debug('📊 Relay Context from GraphQL extensions:', relayContext);
    } else {
      // Priority 2: Headers
      const relayContextHeader = request.headers.get('X-Relay-Context');
      const prefsHeader = request.headers.get('X-Preferences');
      
      if (relayContextHeader) {
        relayContext = {
          ...DEFAULT_PREFERENCES,
          ...JSON.parse(relayContextHeader),
        };
        console.debug('📊 Relay Context from X-Relay-Context header:', relayContext);
      } else if (prefsHeader) {
        relayContext = {
          ...DEFAULT_PREFERENCES,
          ...JSON.parse(prefsHeader),
        };
        console.debug('📊 Relay Context from X-Preferences header (legacy):', relayContext);
      } else {
        // Priority 3: Request cookies
        relayContext = {
          ...DEFAULT_PREFERENCES,
          ...getPreferencesFromRequest(request),
        };
        console.debug('📊 Relay Context from request cookies:', relayContext);
      }
    }
  } catch (error) {
    console.warn('⚠️ Failed to extract relay context:', error);
    relayContext = DEFAULT_PREFERENCES;
  }

  return {
    topdeckClient: new TopdeckClient(),
    preferences: relayContext, // Maintain backward compatibility
    relayContext, // New explicit property
    request,
  };
}