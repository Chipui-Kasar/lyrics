export const AllArtistsJson = [
  {
    href: "#",
    imgSrc: "https://i.ytimg.com/vi/swgXgoqGgqY/maxresdefault.jpg",
    imgWidth: 64,
    imgHeight: 64,
    imgAlt: "Vincent Van Gogh",
    name: "Shimreingam",
    songsCount: "10,000 songs",
  },
  {
    href: "#",
    imgSrc: "https://i.ytimg.com/vi/swgXgoqGgqY/maxresdefault.jpg",
    imgWidth: 64,
    imgHeight: 64,
    imgAlt: "Leonard Cohen",
    name: "Yung yung",
    songsCount: "8,000 songs",
  },
  {
    href: "#",
    imgSrc: "https://i.ytimg.com/vi/swgXgoqGgqY/maxresdefault.jpg",
    imgWidth: 64,
    imgHeight: 64,
    imgAlt: "Billie Holiday",
    name: "Thangmeiso",
    songsCount: "7,500 songs",
  },
  {
    href: "#",
    imgSrc: "https://i.ytimg.com/vi/swgXgoqGgqY/maxresdefault.jpg",
    imgWidth: 64,
    imgHeight: 64,
    imgAlt: "Bob Dylan",
    name: "Oshim Soho",
    songsCount: "9,000 songs",
  },
  {
    href: "#",
    imgSrc: "https://i.ytimg.com/vi/swgXgoqGgqY/maxresdefault.jpg",
    imgWidth: 64,
    imgHeight: 64,
    imgAlt: "Joni Mitchell",
    name: "Nimshimphi",
    songsCount: "6,800 songs",
  },
  {
    href: "#",
    imgSrc: "https://i.ytimg.com/vi/swgXgoqGgqY/maxresdefault.jpg",
    imgWidth: 64,
    imgHeight: 64,
    imgAlt: "Joni Mitchell",
    name: "Ningshang",
    songsCount: "6,800 songs",
  },
  {
    href: "#",
    imgSrc: "https://i.ytimg.com/vi/swgXgoqGgqY/maxresdefault.jpg",
    imgWidth: 64,
    imgHeight: 64,
    imgAlt: "Joni Mitchell",
    name: "Kakami",
    songsCount: "6,800 songs",
  },
  {
    href: "#",
    imgSrc: "https://i.ytimg.com/vi/swgXgoqGgqY/maxresdefault.jpg",
    imgWidth: 64,
    imgHeight: 64,
    imgAlt: "Joni Mitchell",
    name: "Ramchanthing",
    songsCount: "6,800 songs",
  },
  {
    href: "#",
    imgSrc: "https://i.ytimg.com/vi/swgXgoqGgqY/maxresdefault.jpg",
    imgWidth: 64,
    imgHeight: 64,
    imgAlt: "Joni Mitchell",
    name: "Shimshang",
    songsCount: "6,800 songs",
  },
  {
    href: "#",
    imgSrc: "https://i.ytimg.com/vi/swgXgoqGgqY/maxresdefault.jpg",
    imgWidth: 64,
    imgHeight: 64,
    imgAlt: "Joni Mitchell",
    name: "Reitim",
    songsCount: "6,800 songs",
  },
  {
    href: "#",
    imgSrc: "https://i.ytimg.com/vi/swgXgoqGgqY/maxresdefault.jpg",
    imgWidth: 64,
    imgHeight: 64,
    imgAlt: "Joni Mitchell",
    name: "Joni Mitchell",
    songsCount: "6,800 songs",
  },
  {
    href: "#",
    imgSrc: "https://i.ytimg.com/vi/swgXgoqGgqY/maxresdefault.jpg",
    imgWidth: 64,
    imgHeight: 64,
    imgAlt: "Joni Mitchell",
    name: "Joni Mitchell",
    songsCount: "6,800 songs",
  },
  {
    href: "#",
    imgSrc: "https://i.ytimg.com/vi/swgXgoqGgqY/maxresdefault.jpg",
    imgWidth: 64,
    imgHeight: 64,
    imgAlt: "Joni Mitchell",
    name: "Joni Mitchell",
    songsCount: "6,800 songs",
  },
  {
    href: "#",
    imgSrc: "https://i.ytimg.com/vi/swgXgoqGgqY/maxresdefault.jpg",
    imgWidth: 64,
    imgHeight: 64,
    imgAlt: "Joni Mitchell",
    name: "Joni Mitchell",
    songsCount: "6,800 songs",
  },
  {
    href: "#",
    imgSrc: "https://i.ytimg.com/vi/swgXgoqGgqY/maxresdefault.jpg",
    imgWidth: 64,
    imgHeight: 64,
    imgAlt: "Joni Mitchell",
    name: "Joni Mitchell",
    songsCount: "6,800 songs",
  },
  {
    href: "#",
    imgSrc: "https://i.ytimg.com/vi/swgXgoqGgqY/maxresdefault.jpg",
    imgWidth: 64,
    imgHeight: 64,
    imgAlt: "Joni Mitchell",
    name: "Joni Mitchell",
    songsCount: "6,800 songs",
  },
];

export const convertFiletoBase64 = async (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
