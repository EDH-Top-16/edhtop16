import StaplesQueryParameters from '#genfiles/queries/staples_StaplesQuery$parameters';
import {JSResource, ModuleType} from '#genfiles/router/js_resource';
import {EntryPointParams} from '#genfiles/router/router';
import {EntryPoint} from 'react-relay/hooks';

/**
 * @route /staples
 * @param {string?} colorId
 */
export const entrypoint: EntryPoint<
  ModuleType<'m#staples'>,
  EntryPointParams<'/staples'>
> = {
  root: JSResource.fromModuleId('m#staples'),
  getPreloadProps({schema, params}) {
    const {colorId} = schema.parse(params);

    return {
      queries: {
        staplesQueryRef: {
          parameters: StaplesQueryParameters,
          variables: {
            colorId,
          },
        },
      },
      entryPoints: {
        fallback: {
          entryPointParams: {},
          entryPoint: {
            root: JSResource.fromModuleId('m#staples_fallback'),
            getPreloadProps() {
              return {
                queries: {},
                extraProps: {
                  colorId,
                },
              };
            },
          },
        },
      },
    } as const;
  },
};