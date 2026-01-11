import {searchResults, SearchResultType} from '@/lib/schema/search';
import {NextRequest} from 'next/server';

export async function GET(req: NextRequest, _ctx: RouteContext<'/api/search'>) {
  const searchResultTypeStrings = new Set(
    req.nextUrl.searchParams.getAll('type'),
  );

  const searchResultTypes: SearchResultType[] = [];
  if (searchResultTypeStrings.has(SearchResultType.COMMANDER)) {
    searchResultTypes.push(SearchResultType.COMMANDER);
  }
  if (searchResultTypeStrings.has(SearchResultType.TOURNAMENT)) {
    searchResultTypes.push(SearchResultType.TOURNAMENT);
  }

  return Response.json({
    searchResults: await searchResults(searchResultTypes),
  });
}
