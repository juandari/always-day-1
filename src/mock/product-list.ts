/**
 * [
      {
        name: "Tepung",
        price: "Rp13.200",
        link: "https://www.tokopedia.com/find/tepung",
        image: "",
        shopName: "KedaiMart Official Store",
        rating: "4.7",
      },
      {
        name: "Minyak Goreng",
        price: "Rp24.900",
        link: "https://www.tokopedia.com/find/minyak-goreng",
        image: "",
        shopName: "Zeero Bakery",
        rating: "4.7",
      },
      {
        name: "Bawang Merah",
        price: "Rp33.600",
        link: "https://www.tokopedia.com/find/bawang",
        image: "",
        shopName: "STP Bumbu",
        rating: "4.7",
      },
    ]
 */

export const getMockProductList = (ingredients: string[]) => {
  return {
    ingredients: ingredients.map((ingredient) => ({
      name: ingredient,
      price: "Rp13.200",
      link: new URL(`https://www.tokopedia.com/find/${ingredient}`),
      image: "",
      shopName: "KedaiMart Official Store",
      rating: "5.0",
    })),
    tools: [
      {
        name: "Panci",
        price: "Rp13.200",
        link: "https://www.tokopedia.com/find/panci",
        image:
          "https://images.tokopedia.net/img/cache/300-square/VqbcmM/2024/12/21/43db64d8-e7f7-47d8-a860-863728cf4868.jpg",
        shopName: "STP Bumbu",
        rating: "4.7",
      },
      {
        name: "Pisau Dapur",
        price: "Rp130.200",
        link: "https://www.tokopedia.com/find/pisau",
        image:
          "https://images.tokopedia.net/img/cache/300-square/VqbcmM/2024/2/2/8bbed98b-c4ad-436c-b1a7-665050a5d2af.jpg",
        shopName: "IKEA LINDRIG",
        rating: "4.8",
      },
      {
        name: "Kulkas",
        price: "Rp3.000.000",
        link: "https://www.tokopedia.com/find/kulkas",
        image:
          "https://images.tokopedia.net/img/cache/300-square/VqbcmM/2024/4/6/f1ee572f-1f9d-4493-9856-12674817d36f.jpg",
      shopName: "MyHartono",
      rating: "5.0",
    },
    ],
  };
};
