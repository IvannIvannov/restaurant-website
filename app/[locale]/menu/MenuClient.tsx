"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./menu.module.css";

type Locale = "bg" | "en";

type MenuClientProps = {
  locale: Locale;
};

type Category =
  | "all"
  | "starters"
  | "salads"
  | "main"
  | "pizza"
  | "desserts"
  | "drinks";

type MenuItem = {
  id: number;
  category: Exclude<Category, "all">;
  nameBg: string;
  nameEn: string;
  descriptionBg: string;
  descriptionEn: string;
  price: number;
  tags?: string[];
};

const menuItems: MenuItem[] = [
  {
    id: 1,
    category: "starters",
    nameBg: "Бурата с домати",
    nameEn: "Burrata with tomatoes",
    descriptionBg:
      "Кремообразна бурата, сезонни домати, босилек и екстра върджин зехтин.",
    descriptionEn:
      "Creamy burrata, seasonal tomatoes, basil and extra virgin olive oil.",
    price: 13,
    tags: ["vegetarian"],
  },
  {
    id: 2,
    category: "starters",
    nameBg: "Хрупкави калмари",
    nameEn: "Crispy calamari",
    descriptionBg:
      "Калмари с леко хрупкаво покритие, свеж лимон и домашен сос.",
    descriptionEn:
      "Crispy calamari served with fresh lemon and a house-made sauce.",
    price: 15,
  },
  {
    id: 3,
    category: "salads",
    nameBg: "Средиземноморска салата",
    nameEn: "Mediterranean salad",
    descriptionBg:
      "Домати, краставици, маслини, сирене, билки и цитрусов дресинг.",
    descriptionEn:
      "Tomatoes, cucumber, olives, cheese, herbs and citrus dressing.",
    price: 11,
    tags: ["vegetarian"],
  },
  {
    id: 4,
    category: "salads",
    nameBg: "Зелена салата с авокадо",
    nameEn: "Green avocado salad",
    descriptionBg:
      "Микс от свежи зелени салати, авокадо, семена и лек лимонов дресинг.",
    descriptionEn: "Fresh greens, avocado, seeds and a light lemon dressing.",
    price: 12,
    tags: ["vegan"],
  },
  {
    id: 5,
    category: "main",
    nameBg: "Филе от лаврак",
    nameEn: "Sea bass fillet",
    descriptionBg:
      "Лаврак със сезонни зеленчуци, билки и деликатен лимонов сос.",
    descriptionEn:
      "Sea bass with seasonal vegetables, herbs and a delicate lemon sauce.",
    price: 24,
  },
  {
    id: 6,
    category: "main",
    nameBg: "Пиле на грил",
    nameEn: "Grilled chicken",
    descriptionBg:
      "Сочно пилешко филе, картофи, свежи билки и кремообразен сос.",
    descriptionEn:
      "Juicy grilled chicken, potatoes, fresh herbs and creamy sauce.",
    price: 18,
  },
  {
    id: 7,
    category: "pizza",
    nameBg: "Бурата",
    nameEn: "Burrata",
    descriptionBg: "Доматен сос, моцарела, бурата, чери домати и свеж босилек.",
    descriptionEn:
      "Tomato sauce, mozzarella, burrata, cherry tomatoes and fresh basil.",
    price: 16,
    tags: ["vegetarian"],
  },
  {
    id: 8,
    category: "pizza",
    nameBg: "Пикантна салами",
    nameEn: "Spicy salami",
    descriptionBg: "Доматен сос, моцарела, пикантен салам и люти чушки.",
    descriptionEn: "Tomato sauce, mozzarella, spicy salami and chilli peppers.",
    price: 17,
    tags: ["spicy"],
  },
  {
    id: 9,
    category: "desserts",
    nameBg: "Шоколадово суфле",
    nameEn: "Chocolate soufflé",
    descriptionBg: "Топъл шоколадов десерт с течен център и ванилов крем.",
    descriptionEn:
      "Warm chocolate dessert with a molten centre and vanilla cream.",
    price: 9,
    tags: ["vegetarian"],
  },
  {
    id: 10,
    category: "desserts",
    nameBg: "Чийзкейк",
    nameEn: "Cheesecake",
    descriptionBg:
      "Кремообразен чийзкейк със сезонни плодове и фин плодов сос.",
    descriptionEn:
      "Creamy cheesecake with seasonal fruit and a delicate fruit sauce.",
    price: 9,
    tags: ["vegetarian"],
  },
  {
    id: 11,
    category: "drinks",
    nameBg: "Signature Spritz",
    nameEn: "Signature Spritz",
    descriptionBg: "Свеж авторски аперитив с цитрусови нотки и газирана вода.",
    descriptionEn:
      "A fresh signature aperitif with citrus notes and sparkling water.",
    price: 10,
  },
  {
    id: 12,
    category: "drinks",
    nameBg: "Tropical Zero",
    nameEn: "Tropical Zero",
    descriptionBg:
      "Безалкохолен коктейл с тропически плодове, лайм и свежа мента.",
    descriptionEn:
      "Alcohol-free cocktail with tropical fruit, lime and fresh mint.",
    price: 8,
    tags: ["vegan"],
  },
];

const translations = {
  bg: {
    back: "Начало",
    title: "МЕНЮ",
    all: "Всички",
    starters: "Предястия",
    salads: "Салати",
    main: "Основни",
    pizza: "Пица",
    desserts: "Десерти",
    drinks: "Напитки",
    vegetarian: "Вегетарианско",
    vegan: "Веган",
    spicy: "Пикантно",
    reserve: "Запази маса",
  },
  en: {
    back: "Home",
    title: "MENU",
    all: "All",
    starters: "Starters",
    salads: "Salads",
    main: "Main",
    pizza: "Pizza",
    desserts: "Desserts",
    drinks: "Drinks",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    spicy: "Spicy",
    reserve: "Reserve a table",
  },
};

export default function MenuClient({ locale }: MenuClientProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const t = translations[locale];

  const categories = [
    { id: "all" as Category, label: t.all },
    { id: "starters" as Category, label: t.starters },
    { id: "salads" as Category, label: t.salads },
    { id: "main" as Category, label: t.main },
    { id: "pizza" as Category, label: t.pizza },
    { id: "desserts" as Category, label: t.desserts },
    { id: "drinks" as Category, label: t.drinks },
  ];

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const getTagLabel = (tag: string) => {
    if (tag === "vegetarian") return t.vegetarian;
    if (tag === "vegan") return t.vegan;
    if (tag === "spicy") return t.spicy;

    return tag;
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href={`/${locale}`} className={styles.backLink}>
          ← {t.back}
        </Link>

        <div className={styles.languageSwitcher}>
          <Link
            href="/bg/menu"
            className={locale === "bg" ? styles.activeLanguage : ""}
          >
            BG
          </Link>

          <span>/</span>

          <Link
            href="/en/menu"
            className={locale === "en" ? styles.activeLanguage : ""}
          >
            EN
          </Link>
        </div>
      </header>

      <section className={styles.intro}>
        <h1>{t.title}</h1>
      </section>

      <section className={styles.menuSection}>
        <div className={styles.categories}>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={
                activeCategory === category.id
                  ? styles.categoryActive
                  : styles.categoryButton
              }
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className={styles.menuList}>
          {filteredItems.map((item) => (
            <article className={styles.menuItem} key={item.id}>
              <div>
                <h2>{locale === "bg" ? item.nameBg : item.nameEn}</h2>

                <p>
                  {locale === "bg" ? item.descriptionBg : item.descriptionEn}
                </p>

                {item.tags && (
                  <div className={styles.tags}>
                    {item.tags.map((tag) => (
                      <span key={tag}>{getTagLabel(tag)}</span>
                    ))}
                  </div>
                )}
              </div>

              <span className={styles.price}>€{item.price}</span>
            </article>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <Link href={`/${locale}/reservations`} className={styles.reserveButton}>
          {t.reserve}
          <span>↗</span>
        </Link>
      </footer>
    </main>
  );
}
