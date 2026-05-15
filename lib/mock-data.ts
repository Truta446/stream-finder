import type { Title } from "./api/types"

export const mockTitles: Title[] = [
  {
    id: "1",
    title: "How I Met Your Mother",
    year: 2005,
    type: "tv",
    poster: "https://image.tmdb.org/t/p/w500/b34jPzmB0wZy7EjUZoleXOl2RRI.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/aIqnLEZ2WJuHO1T6JQD60hg2vxH.jpg",
    description: "A father recounts to his children - through a series of flashbacks - the journey he and his four best friends took leading up to him meeting their mother.",
    rating: 8.3,
    genres: ["Comedy", "Romance", "Drama"],
    seasons: 9,
    providers: {
      US: [
        { id: "hulu", name: "Hulu", logo: "https://images.justwatch.com/icon/116305230/s100/hulu.webp", type: "subscription", url: "#" },
        { id: "amazon", name: "Amazon", logo: "https://images.justwatch.com/icon/52449861/s100/amazonprimevideo.webp", type: "rent", url: "#" },
      ],
      BR: [
        { id: "disney", name: "Disney+", logo: "https://images.justwatch.com/icon/147638351/s100/disneyplus.webp", type: "subscription", url: "#" },
        { id: "prime", name: "Prime Video", logo: "https://images.justwatch.com/icon/52449861/s100/amazonprimevideo.webp", type: "subscription", url: "#" },
      ],
      AR: [
        { id: "disney", name: "Disney+", logo: "https://images.justwatch.com/icon/147638351/s100/disneyplus.webp", type: "subscription", url: "#" },
      ],
      MX: [
        { id: "disney", name: "Disney+", logo: "https://images.justwatch.com/icon/147638351/s100/disneyplus.webp", type: "subscription", url: "#" },
      ],
      ES: [
        { id: "disney", name: "Disney+", logo: "https://images.justwatch.com/icon/147638351/s100/disneyplus.webp", type: "subscription", url: "#" },
      ],
    },
  },
  {
    id: "2",
    title: "Interstellar",
    year: 2014,
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    rating: 8.7,
    genres: ["Science Fiction", "Drama", "Adventure"],
    runtime: "2h 49min",
    providers: {
      US: [
        { id: "paramount", name: "Paramount+", logo: "https://images.justwatch.com/icon/232697473/s100/paramount-plus.webp", type: "subscription", url: "#" },
        { id: "apple", name: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv-plus.webp", type: "rent", url: "#" },
      ],
      BR: [
        { id: "netflix", name: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", type: "subscription", url: "#" },
        { id: "prime", name: "Prime Video", logo: "https://images.justwatch.com/icon/52449861/s100/amazonprimevideo.webp", type: "rent", url: "#" },
      ],
      AR: [
        { id: "netflix", name: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", type: "subscription", url: "#" },
      ],
      MX: [
        { id: "netflix", name: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", type: "subscription", url: "#" },
      ],
      ES: [
        { id: "movistar", name: "Movistar+", logo: "https://images.justwatch.com/icon/128599720/s100/movistar-plus.webp", type: "subscription", url: "#" },
      ],
    },
  },
  {
    id: "3",
    title: "The Office",
    year: 2005,
    type: "tv",
    poster: "https://image.tmdb.org/t/p/w500/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/iOZJ9ZFvWxgR0Ye5aNf91eDYQcK.jpg",
    description: "The everyday lives of office employees in the Scranton, Pennsylvania branch of the fictional Dunder Mifflin Paper Company.",
    rating: 8.9,
    genres: ["Comedy"],
    seasons: 9,
    providers: {
      US: [
        { id: "peacock", name: "Peacock", logo: "https://images.justwatch.com/icon/194426515/s100/peacock.webp", type: "subscription", url: "#" },
      ],
      BR: [
        { id: "prime", name: "Prime Video", logo: "https://images.justwatch.com/icon/52449861/s100/amazonprimevideo.webp", type: "subscription", url: "#" },
      ],
      AR: [
        { id: "prime", name: "Prime Video", logo: "https://images.justwatch.com/icon/52449861/s100/amazonprimevideo.webp", type: "subscription", url: "#" },
      ],
      MX: [
        { id: "prime", name: "Prime Video", logo: "https://images.justwatch.com/icon/52449861/s100/amazonprimevideo.webp", type: "subscription", url: "#" },
      ],
      ES: [
        { id: "prime", name: "Prime Video", logo: "https://images.justwatch.com/icon/52449861/s100/amazonprimevideo.webp", type: "subscription", url: "#" },
      ],
    },
  },
  {
    id: "4",
    title: "Friends",
    year: 1994,
    type: "tv",
    poster: "https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/6S5ulYBv7rKPSlYhz7M3rXKE71R.jpg",
    description: "Six friends living in New York City navigate the ups and downs of life, love, and careers while spending time at their favorite coffee shop.",
    rating: 8.4,
    genres: ["Comedy", "Romance"],
    seasons: 10,
    providers: {
      US: [
        { id: "max", name: "Max", logo: "https://images.justwatch.com/icon/305458112/s100/max.webp", type: "subscription", url: "#" },
      ],
      BR: [
        { id: "max", name: "Max", logo: "https://images.justwatch.com/icon/305458112/s100/max.webp", type: "subscription", url: "#" },
      ],
      AR: [
        { id: "max", name: "Max", logo: "https://images.justwatch.com/icon/305458112/s100/max.webp", type: "subscription", url: "#" },
      ],
      MX: [
        { id: "max", name: "Max", logo: "https://images.justwatch.com/icon/305458112/s100/max.webp", type: "subscription", url: "#" },
      ],
      ES: [
        { id: "max", name: "Max", logo: "https://images.justwatch.com/icon/305458112/s100/max.webp", type: "subscription", url: "#" },
      ],
    },
  },
  {
    id: "5",
    title: "Breaking Bad",
    year: 2008,
    type: "tv",
    poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    description: "A high school chemistry teacher diagnosed with lung cancer turns to manufacturing and selling methamphetamine to secure his family's future.",
    rating: 9.5,
    genres: ["Drama", "Crime", "Thriller"],
    seasons: 5,
    providers: {
      US: [
        { id: "netflix", name: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", type: "subscription", url: "#" },
      ],
      BR: [
        { id: "netflix", name: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", type: "subscription", url: "#" },
      ],
      AR: [
        { id: "netflix", name: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", type: "subscription", url: "#" },
      ],
      MX: [
        { id: "netflix", name: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", type: "subscription", url: "#" },
      ],
      ES: [
        { id: "netflix", name: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", type: "subscription", url: "#" },
        { id: "movistar", name: "Movistar+", logo: "https://images.justwatch.com/icon/128599720/s100/movistar-plus.webp", type: "subscription", url: "#" },
      ],
    },
  },
  {
    id: "6",
    title: "The Dark Knight",
    year: 2008,
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    rating: 9.0,
    genres: ["Action", "Crime", "Drama"],
    runtime: "2h 32min",
    providers: {
      US: [
        { id: "max", name: "Max", logo: "https://images.justwatch.com/icon/305458112/s100/max.webp", type: "subscription", url: "#" },
        { id: "apple", name: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv-plus.webp", type: "rent", url: "#" },
      ],
      BR: [
        { id: "max", name: "Max", logo: "https://images.justwatch.com/icon/305458112/s100/max.webp", type: "subscription", url: "#" },
      ],
      AR: [
        { id: "max", name: "Max", logo: "https://images.justwatch.com/icon/305458112/s100/max.webp", type: "subscription", url: "#" },
      ],
      MX: [
        { id: "max", name: "Max", logo: "https://images.justwatch.com/icon/305458112/s100/max.webp", type: "subscription", url: "#" },
      ],
      ES: [
        { id: "max", name: "Max", logo: "https://images.justwatch.com/icon/305458112/s100/max.webp", type: "subscription", url: "#" },
      ],
    },
  },
  {
    id: "7",
    title: "Stranger Things",
    year: 2016,
    type: "tv",
    poster: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    rating: 8.7,
    genres: ["Drama", "Fantasy", "Horror"],
    seasons: 4,
    providers: {
      US: [
        { id: "netflix", name: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", type: "subscription", url: "#" },
      ],
      BR: [
        { id: "netflix", name: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", type: "subscription", url: "#" },
      ],
      AR: [
        { id: "netflix", name: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", type: "subscription", url: "#" },
      ],
      MX: [
        { id: "netflix", name: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", type: "subscription", url: "#" },
      ],
      ES: [
        { id: "netflix", name: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", type: "subscription", url: "#" },
      ],
    },
  },
  {
    id: "8",
    title: "Inception",
    year: 2010,
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    rating: 8.8,
    genres: ["Action", "Science Fiction", "Adventure"],
    runtime: "2h 28min",
    providers: {
      US: [
        { id: "amazon", name: "Amazon", logo: "https://images.justwatch.com/icon/52449861/s100/amazonprimevideo.webp", type: "rent", url: "#" },
        { id: "apple", name: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv-plus.webp", type: "rent", url: "#" },
      ],
      BR: [
        { id: "max", name: "Max", logo: "https://images.justwatch.com/icon/305458112/s100/max.webp", type: "subscription", url: "#" },
      ],
      AR: [
        { id: "max", name: "Max", logo: "https://images.justwatch.com/icon/305458112/s100/max.webp", type: "subscription", url: "#" },
      ],
      MX: [
        { id: "max", name: "Max", logo: "https://images.justwatch.com/icon/305458112/s100/max.webp", type: "subscription", url: "#" },
      ],
      ES: [
        { id: "netflix", name: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", type: "subscription", url: "#" },
      ],
    },
  },
]

