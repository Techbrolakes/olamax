import type { PublicDomainFilm } from "./types";

// Curated public-domain films streaming from archive.org.
// Each entry pairs a TMDB id with an Internet Archive identifier + direct MP4 URL.
// Download URLs follow the pattern: https://archive.org/download/{sourceId}/{filename}
export const PUBLIC_DOMAIN_CATALOG: PublicDomainFilm[] = [
  {
    slug: "nosferatu-1922",
    tmdbId: 653,
    source: "archive.org",
    sourceId: "nosferatu-1922",
    stream: {
      type: "mp4",
      url: "https://archive.org/download/nosferatu-1922/Nosferatu%20%281922%29.mp4",
    },
    title: "Nosferatu",
    year: 1922,
    runtime: 94,
    director: "F. W. Murnau",
    synopsis:
      "A vampire lurks in the Carpathians, preying on a young man's wife in this unauthorized adaptation of Dracula that defined a century of horror.",
  },
  {
    slug: "metropolis-1927",
    tmdbId: 19,
    source: "archive.org",
    sourceId: "metropolis-1927-bdrip-1080p-x-265-dts-hd-ma-5.1-d-0ct-0r-lew-sev",
    stream: {
      type: "mp4",
      url: "https://archive.org/download/metropolis-1927-bdrip-1080p-x-265-dts-hd-ma-5.1-d-0ct-0r-lew-sev/Metropolis%201927%20BDrip%201080p%20x265%20DTS-HD%20MA%205.1%20D0ct0rLew%5BSEV%5D.mp4",
    },
    title: "Metropolis",
    year: 1927,
    runtime: 153,
    director: "Fritz Lang",
    synopsis:
      "In a towering future city built on the backs of underground labourers, the son of the master of Metropolis falls for a prophet among the workers.",
  },
  {
    slug: "the-general-1926",
    tmdbId: 957,
    source: "archive.org",
    sourceId: "The_General_Buster_Keaton",
    stream: {
      type: "mp4",
      url: "https://archive.org/download/The_General_Buster_Keaton/The_General.mp4",
    },
    title: "The General",
    year: 1926,
    runtime: 78,
    director: "Buster Keaton",
    synopsis: "A Southern railway engineer races to rescue his locomotive — and his girl — from Union spies.",
  },
  {
    slug: "night-of-the-living-dead-1968",
    tmdbId: 10331,
    source: "archive.org",
    sourceId: "Night.Of.The.Living.Dead_1080p",
    stream: {
      type: "mp4",
      url: "https://archive.org/download/Night.Of.The.Living.Dead_1080p/NightOfTheLivingDead_PS3.mp4",
    },
    title: "Night of the Living Dead",
    year: 1968,
    runtime: 96,
    director: "George A. Romero",
    synopsis:
      "Seven strangers barricade themselves in a rural Pennsylvania farmhouse as the recently dead rise and hunt the living.",
  },
  {
    slug: "plan-9-from-outer-space-1959",
    tmdbId: 817,
    source: "archive.org",
    sourceId: "plan-9-from-outer-space_202009",
    stream: {
      type: "mp4",
      url: "https://archive.org/download/plan-9-from-outer-space_202009/Plan%209%20from%20Outer%20Space.mp4",
    },
    title: "Plan 9 from Outer Space",
    year: 1959,
    runtime: 79,
    director: "Ed Wood",
    synopsis:
      "Aliens execute Plan 9 — resurrect Earth's dead to stop humanity from developing a doomsday weapon.",
  },
  {
    slug: "his-girl-friday-1940",
    tmdbId: 3085,
    source: "archive.org",
    sourceId: "his_girl_friday",
    stream: {
      type: "mp4",
      url: "https://archive.org/download/his_girl_friday/his_girl_friday.mp4",
    },
    title: "His Girl Friday",
    year: 1940,
    runtime: 92,
    director: "Howard Hawks",
    synopsis:
      "A newspaper editor uses every trick in the book to keep his ace reporter — and ex-wife — from remarrying and leaving the paper.",
  },
  {
    slug: "d-o-a-1949",
    tmdbId: 25986,
    source: "archive.org",
    sourceId: "d.-o.-a.-1950",
    stream: {
      type: "mp4",
      url: "https://archive.org/download/d.-o.-a.-1950/D.O.A.%20%281949%29.mp4",
    },
    title: "D.O.A.",
    year: 1949,
    runtime: 83,
    director: "Rudolph Maté",
    synopsis:
      "A man stumbles into a police station to report a murder — his own — and retraces the 24 hours that led to his slow-acting poisoning.",
  },
  {
    slug: "charade-1963",
    tmdbId: 4808,
    source: "archive.org",
    sourceId: "charade-stanley-donen-1963-cary-grant-audrey-hepburn-comedie-policiere",
    stream: {
      type: "mp4",
      url: "https://archive.org/download/charade-stanley-donen-1963-cary-grant-audrey-hepburn-comedie-policiere/Charade%20Stanley%20Donen%201963%20Cary%20Grant%20Audrey%20Hepburn%20Com%C3%A9die%20polici%C3%A8re.mp4",
    },
    title: "Charade",
    year: 1963,
    runtime: 113,
    director: "Stanley Donen",
    synopsis:
      "A Paris widow is pursued by strangers all after a fortune her late husband stole — and helped by a charming man with too many names.",
  },
  {
    slug: "carnival-of-souls-1962",
    tmdbId: 14756,
    source: "archive.org",
    sourceId: "CarnivalofSouls",
    stream: {
      type: "mp4",
      url: "https://archive.org/download/CarnivalofSouls/CarnivalOfSouls.mp4",
    },
    title: "Carnival of Souls",
    year: 1962,
    runtime: 78,
    director: "Herk Harvey",
    synopsis:
      "The sole survivor of a car crash is drawn to an abandoned carnival pavilion — and to a pale figure following her everywhere.",
  },
  {
    slug: "detour-1945",
    tmdbId: 18199,
    source: "archive.org",
    sourceId: "Detour",
    stream: {
      type: "mp4",
      url: "https://archive.org/download/Detour/Detour.mp4",
    },
    title: "Detour",
    year: 1945,
    runtime: 68,
    director: "Edgar G. Ulmer",
    synopsis:
      "A hitchhiking pianist picks up the wrong ride — and then the wrong woman — in this bare-bones B-noir now considered a classic.",
  },
  {
    slug: "the-cabinet-of-dr-caligari-1920",
    tmdbId: 1069,
    source: "archive.org",
    sourceId: "DasKabinettdesDoktorCaligariTheCabinetofDrCaligari",
    stream: {
      type: "mp4",
      url: "https://archive.org/download/DasKabinettdesDoktorCaligariTheCabinetofDrCaligari/The_Cabinet_of_Dr._Caligari_512kb.mp4",
    },
    title: "The Cabinet of Dr. Caligari",
    year: 1920,
    runtime: 78,
    director: "Robert Wiene",
    synopsis:
      "A hypnotist at a German carnival dispatches a sleepwalking assassin to do his bidding in the definitive film of German Expressionism.",
  },
  {
    slug: "m-1931",
    tmdbId: 832,
    source: "archive.org",
    sourceId: "MFritzLangPublicDomainMovies",
    stream: {
      type: "mp4",
      url: "https://archive.org/download/MFritzLangPublicDomainMovies/M%20-%20Fritz%20Lang%20%20%20Public%20Domain%20Movies.mp4",
    },
    title: "M",
    year: 1931,
    runtime: 117,
    director: "Fritz Lang",
    synopsis:
      "A Berlin besieged by a serial child-killer turns on itself as both police and the underworld hunt the man.",
  },
];

export function getAllPublicDomainFilms(): PublicDomainFilm[] {
  return PUBLIC_DOMAIN_CATALOG;
}
