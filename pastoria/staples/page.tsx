import {ColorSelection} from '#components/color_selection.js';
import {LoadingIcon} from '#components/fallback.js';
import {Navigation} from '#components/navigation.js';
import {Select} from '#components/select.js';
import {useNavigation, useRouteParams} from '#genfiles/router/router.js';
import {PageProps} from '#genfiles/router/types.js';
import {Suspense} from 'react';
import {EntryPointContainer} from 'react-relay/hooks';

export default function StaplesPageShell({entryPoints}: PageProps<'/staples'>) {
  const {colorId = '', type = ''} = useRouteParams('/staples');
  const {replaceRoute} = useNavigation();

  return (
    <>
      <title>cEDH Staples</title>
      <meta
        name="description"
        content="Discover the most played cards in competitive EDH!"
      />
      <Navigation searchType="tournament" />

      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-xl) px-6">
        <div className="mb-8">
          <h1 className="font-title text-4xl font-extrabold text-white md:text-5xl">
            cEDH Staples
          </h1>
          <p className="mt-2 text-white/60">
            The most popular cards in competitive EDH, based on tournament data
            from the last year.
          </p>
        </div>

        <div className="mb-8 flex flex-col items-start space-y-4 md:flex-row md:items-end md:space-y-0">
          <div className="flex-1">
            <ColorSelection
              selected={colorId}
              onChange={(value) => {
                replaceRoute('/staples', {
                  colorId: value || null,
                  type: type || null,
                });
              }}
            />
          </div>

          <div className="w-full md:w-auto">
            <Select
              id="staples-type-filter"
              label="Type Filter"
              value={type || 'all'}
              onChange={(value) => {
                replaceRoute('/staples', {
                  colorId: colorId || null,
                  type: value === 'all' ? null : value,
                });
              }}
            >
              <option value="all">All Types</option>
              <option value="creature">Creature</option>
              <option value="instant">Instant</option>
              <option value="sorcery">Sorcery</option>
              <option value="artifact">Artifact</option>
              <option value="enchantment">Enchantment</option>
              <option value="planeswalker">Planeswalker</option>
              <option value="land">Land</option>
            </Select>
          </div>
        </div>

        <Suspense fallback={<LoadingIcon />}>
          <EntryPointContainer
            entryPointReference={entryPoints.content}
            props={{}}
          />
        </Suspense>
      </div>
    </>
  );
}
