import { ValueOf } from 'type-fest';

import { PlexObject } from './base/plexObject';
import { MatchSearchResult } from './search.types';
import { rsplit } from './util';

export const SEARCHTYPES = {
  movie: 1,
  show: 2,
  season: 3,
  episode: 4,
  trailer: 5,
  comic: 6,
  person: 7,
  artist: 8,
  album: 9,
  track: 10,
  picture: 11,
  clip: 12,
  photo: 13,
  photoalbum: 14,
  playlist: 15,
  playlistFolder: 16,
  collection: 18,
  userPlaylistItem: 1001,
} as const;

export class SearchResult extends PlexObject {
  static TAG = 'SearchResult';

  guid!: string;
  name!: string;
  score!: number;
  year!: number;
  lifespanEnded!: boolean;

  protected _loadData(data: MatchSearchResult) {
    this.guid = data.guid;
    this.lifespanEnded = data.lifespanEnded;
    this.name = data.name;
    this.score = data.score;
    this.year = data.year;
  }
}

/**
 * Represents a single Agent
 */
export class Agent extends PlexObject {
  static TAG = 'Agent';

  hasAttribution!: boolean;
  hasPrefs!: boolean;
  identifier!: string;
  primary!: string;
  shortIdentifier!: string;
  name!: string;
  // languageCode: any[] = [];

  protected _loadData(data: any) {
    this.hasAttribution = data.hasAttribution;
    this.hasPrefs = data.hasPrefs;
    this.identifier = data.identifier;
    this.primary = data.primary;
    this.shortIdentifier = rsplit(this.identifier, '.', 1)[1];
    if (this.initpath.includes('mediaType')) {
      this.name = data.name;
      // this.languageCode = [];
      // TODO: languageCode
    }
  }
}

type SearchTypesValues = ValueOf<typeof SEARCHTYPES>;
/**
 * Returns the integer value of the library string type.
 * @param libtype to lookup (movie, show, season, episode, artist, album, track, collection)
 */
export function searchType(
  libtype: string | number | keyof typeof SEARCHTYPES | SearchTypesValues,
): SearchTypesValues {
  if (
    Object.values(SEARCHTYPES)
      .map(x => x.toString())
      .includes(libtype.toString())
  ) {
    return Number(libtype) as SearchTypesValues;
  }

  if (SEARCHTYPES[libtype] !== undefined) {
    return SEARCHTYPES[libtype];
  }

  throw new Error(`Unknown libtype: ${libtype}`);
}
