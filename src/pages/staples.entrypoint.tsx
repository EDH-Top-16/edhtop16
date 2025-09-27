import StaplesQueryParameters from '#genfiles/queries/staples_StaplesQuery$parameters';
import {JSResource, ModuleType} from '#genfiles/router/js_resource';
import {EntryPointParams} from '#genfiles/router/router';
import {EntryPoint} from 'react-relay/hooks';

/**
 * @route /staples
 * @param {string?} colorId
 * @param {string?} type
 */
export const entrypoint: EntryPoint<
  ModuleType<'m#staples'>,
  EntryPointParams<'/staples'>
> = {
  root: JSResource.fromModuleId('m#staples'),
  getPreloadProps({schema, params}) {
    const {colorId, type} = schema.parse(params);

    return {
      queries: {
        staplesQueryRef: {
          parameters: StaplesQueryParameters,
          variables: {
            colorId,
            type,
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
                  type,
                },
              };
            },
          },
        },
      },
    } as const;
  },
};
