/** Ảnh trong khung giữa loader. Thay file cùng tên trong public/images/loader/ */
export const loaderImages = [
  "/images/loader/01.png",
  "/images/loader/02.png",
  "/images/loader/03.png",
]

/** Số lượt chạy 01 → 02 → 03 trước khi vào màn chính. */
export const loaderCycles = 3

/** Mỗi ảnh hiện bao lâu (ms). Thanh tiến độ chạy đúng bằng tổng thời gian này. */
export const loaderFrameMs = 680

/** Chữ cạnh khung loader. */
export const loaderCopy = {
  lines: ["A little luck,", "A lot of surprises"],
  caption: "Built by Toanhh",
}

/** Ảnh hàng ngang màn chính. Thay file trong public/images/gallery/ */
export const galleryImages = [
  "/images/gallery/01.png",
  "/images/gallery/02.png",
  "/images/gallery/03.png",
  "/images/gallery/04.png",
  "/images/gallery/05.png",
]

/** 5 mục menu = 5 ảnh gallery theo thứ tự. Ảnh trang chi tiết: public/images/pages/ */
export const menuItems = [
  {
    id: "lucky-cookie",
    index: "01",
    title: "Lucky Cookie",
    path: "/lucky-cookie",
    image: "/images/pages/01.png",
  },
  {
    id: "lucky-locker",
    index: "02",
    title: "Lucky Locker",
    path: "/lucky-locker",
    image: "/images/pages/02.png",
  },
  {
    id: "lucky-spin",
    index: "03",
    title: "Lucky Spin",
    path: "/lucky-spin",
    image: "/images/pages/03.png",
  },
  {
    id: "lucky-ticket",
    index: "04",
    title: "Lucky Ticket",
    path: "/lucky-ticket",
    image: "/images/pages/04.png",
  },
  {
    id: "lucky-catch",
    index: "05",
    title: "Lucky Catch",
    path: "/lucky-catch",
    image: "/images/pages/05.png",
  },
]

export const site = {
  brand: "Lucky Ppopgi",
  menu: "Menu",
  lockup: ["A little luck,", "A lot of surprises"],
  wish: "A little wish for you",
  builtBy: "Built by Toanhh",
  footer: {
    left: "Lucky Ppopgi - A little world of luck",
    center: "*Your luck starts here*",
    right: "Today might be your lucky day.",
  },
}

/**
 * Luồng "What Luck Today?" — mở khi click ảnh gallery 03.
 * intro: ảnh 06 phóng to từ giữa màn hình (zoomMs) rồi giữ holdMs, sau đó tự sang menu (ảnh 07).
 * Ô trong menu: vị trí tính theo % của ảnh 07 (1678×937). label/icon: % trong ô.
 */
export const luckyFlow = {
  galleryIndex: 2, // ảnh gallery 03 (đếm từ 0)
  introImage: "/images/gallery/06.png",
  introAspect: 1671 / 941, // kích thước ảnh 06 — dùng để đặt khung hover đúng vị trí khi ảnh cover
  menuImage: "/images/gallery/07.png",
  menuAspect: 1678 / 937,
  menuBackground: "#FCF8F0",
  hoverColor: "#6D3912",
  hoverText: "#F5EDDE",
  hoverIcon: "/images/gallery/08-cutout.png",
  zoomMs: 1200,
  holdMs: 2000,
  storageKey: "luckyChoice",
  options: [
    {
      id: "small-joys",
      title: "Small Joys",
      rect: { left: 7.63, top: 29.03, width: 16.87, height: 30.31 },
      label: { x: 11.3, y: 82, align: "left" },
      icon: { x: 70.7, y: 33.6 },
    },
    {
      id: "travel-outings",
      title: "Travel/Outings",
      rect: { left: 24.49, top: 29.03, width: 16.98, height: 30.31 },
      label: { x: 11.2, y: 20.4, align: "left" },
      icon: { x: 70.7, y: 66.4 },
    },
    {
      id: "health",
      title: "Health",
      rect: { left: 75.33, top: 29.03, width: 16.98, height: 30.31 },
      label: { x: 89.1, y: 82, align: "right" },
      icon: { x: 32, y: 36 },
    },
    {
      id: "hobbies",
      title: "Hobbies",
      rect: { left: 7.63, top: 59.45, width: 16.87, height: 30.2 },
      label: { x: 88.7, y: 82, align: "right" },
      icon: { x: 32, y: 36 },
    },
    {
      id: "todays-luck",
      title: "Today’s Luck",
      rect: { left: 41.48, top: 59.45, width: 16.87, height: 30.2 },
      label: { x: 23, y: 20.1, align: "left" },
      icon: { x: 70.7, y: 66.4 },
    },
    {
      id: "rest",
      title: "Rest",
      rect: { left: 58.34, top: 59.45, width: 16.98, height: 30.2 },
      label: { x: 12.3, y: 20.1, align: "left" },
      icon: { x: 70.7, y: 66.4 },
    },
  ],

  /** 2 nút góc trái ở màn 06 bước 2 + màn gif (Home nằm dưới Back, mép trên ngang mép trên khung 01). */
  nav: {
    back: "Back",
    home: "Home",
  },
  /**
   * Màn 06 bước 2 (sau khi chọn ở 07): hover vào tên trên bệ → hiện bảng mô tả (mẫu: gallery/06_display.png).
   * frame: vị trí khung kính theo % của ảnh 06 (1671×941). Vùng hover + bảng mô tả đặt theo % của khung (xem LuckyFlow.css).
   * Click khung → chạy gif tương ứng (public/images/gif/01-04.gif, thứ tự trái→phải, trên→dưới) đúng 1 lần,
   * dừng ở khung cuối (tờ giấy trắng) rồi hiện 1 lời nhắn random theo lựa chọn ở màn 07 (xem messages).
   */
  shelf: [
    {
      id: "fortune-cookie",
      gif: "/images/gif/01.gif",
      title: "Fortune Cookie",
      frame: { left: 13.47, top: 6.7, width: 34.05, height: 40.91 },
      body: [
        "A Fortune Cookie is a crisp, folded cookie with a little message hidden inside. Popular in Chinese American restaurants, it has become a playful symbol of luck and unexpected surprises.",
        "Break one open, discover your message, and perhaps find a little encouragement waiting just for you.",
      ],
    },
    {
      id: "may-box",
      gif: "/images/gif/02.gif",
      title: "May Box",
      frame: { left: 52.48, top: 6.7, width: 33.93, height: 40.91 },
      body: [
        "In many Vietnamese homes, an old biscuit tin often finds a second life as a sewing box, holding needles, threads, buttons, and little everyday memories.",
        "Inspired by this familiar tradition, the May Box plays with the Vietnamese word “may,” meaning both sewing and luck. Open the box and discover a small piece of good fortune tucked inside.",
      ],
    },
    {
      id: "vasilopita",
      gif: "/images/gif/03.gif",
      title: "Vasilopita",
      frame: { left: 13.47, top: 51.86, width: 34.05, height: 40.38 },
      body: [
        "Vasilopita is a traditional Greek New Year’s cake, shared with family and friends to welcome the coming year. A coin is hidden inside the cake, and whoever finds it in their slice is believed to receive good luck for the year ahead.",
        "Every slice carries a little anticipation, and every new year begins with the hope of something wonderful.",
      ],
    },
    {
      id: "galette-des-rois",
      gif: "/images/gif/04.gif",
      title: "Galette des Rois",
      frame: { left: 52.48, top: 51.86, width: 33.93, height: 40.38 },
      body: [
        "Galette des Rois, known as the King’s Cake, is a traditional French pastry enjoyed during Epiphany in January. Hidden inside is a tiny charm called a fève. Whoever discovers it is crowned king or queen for the day.",
        "Behind its golden, flaky layers lies a playful tradition filled with surprise, celebration, and a little royal luck.",
      ],
    },
  ],
  /**
   * Lời nhắn hiện trên tờ giấy cuối gif — chép từ public/doc/Messages.docx.
   * Key = id option ở màn 07; mỗi option 5 câu, random 1 câu mỗi lần mở gif.
   */
  messages: {
    "small-joys": [
      "Clean sheets and an early night make a pretty good ending to the day.",
      "May your first sip be exactly the temperature you hoped for.",
      "You’ll tap the wrong floor in the elevator. Someone will get in and thank you for pressing theirs.",
      "Someone will say exactly what you were thinking. Enjoy being right without having to speak.",
      "The zipper will glide right past the spot where it usually gets stuck. Apparently, it’s been working on itself.",
    ],
    "travel-outings": [
      "The best photo of your day might be the one you didn’t plan to take.",
      "May the bus arrive just as you get to the stop. Bonus luck if there’s a window seat.",
      "Your first photo will be the best one. The next forty-three are for legal reasons.",
      "You’ll hear leaves crunch underfoot. Congratulations on finding a route with sound effects.",
      "The first breeze outside will feel like someone finally opened a window in your head.",
    ],
    "hobbies": [
      "Practice your autograph. You never know when someone will ask you to sign a particularly good doodle.",
      "Give yourself a quiz about your own favorite things. If you get an answer wrong, update the answer key.",
      "Your favorite part of the day is allowed to be something very hard to explain.",
      "You can enjoy something once and never do it again. It was a hobby, not a subscription.",
      "If nothing comes to mind when someone asks about your hobbies, “I’m still browsing” will do.",
    ],
    "health": [
      "Tuck your worries into a drawer and go to bed. If they knock, pretend you’re asleep.",
      "Get a little warmer if you’re cold. There’s no trophy for shivering with dignity.",
      "If you’ve been frowning at a tiny task, give your face a break. The task hasn’t noticed.",
      "If the light is too bright, turn it down. Your eyes didn’t agree to be interviewed.",
      "If you catch yourself holding your breath while opening a message, breathe out. It’s a notification, not a diving competition.",
    ],
    "todays-luck": [
      "Your lucky outfit is whatever you’re already wearing. This reading is final. Please stop changing.",
      "Your lucky number is 404. Your bad luck could not be found.",
      "The good news is that you’ll find your glasses. The less impressive news is that you’re wearing them.",
      "Your lucky shape is a triangle. Pizza qualifies as geometry today.",
      "Your lucky letter is B. You may interpret that as “bakery,” “break,” or “both.”",
    ],
    "rest": [
      "If your blanket is calling, it’s perfectly polite to answer.",
      "You opened this cookie looking for a sign to stop working. This is the sign. Please stop opening cookies for a second opinion.",
      "Take your shoes off. Whatever happens next, at least the day has lost custody of your feet.",
      "If your brain starts replaying something embarrassing from 2017, ask for the remote. You’ve seen this episode.",
      "If you wake up before your alarm, turn over. That was a preview of tomorrow, and you’re allowed to skip it.",
    ],
  },
}
