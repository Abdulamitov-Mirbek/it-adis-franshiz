# Франшиза IT ADIS — сайт-визитка

Одностраничный сайт франшизы IT ADIS: первый экран и 9 разделов из обновлённого HTML-прототипа, на русском и кыргызском языках.
Фронтенд: **React 19 + TypeScript + Vite**, 3D — **three.js / @react-three/fiber**.

Визуально это не перенос прототипа «один в один», а полноценный редизайн:
тёмный первый экран во весь вьюпорт, нумерация экранов 01–05, вертикальный рельс
прогресса, крупная типографика с курсивными акцентами, 3D-сцены на первом экране
и в блоке заявки. Тексты, цифры и бренд-цвета — строго из ТЗ.

## Запуск

```bash
npm install
cp .env.example .env     # заполнить по мере получения доступов
npm run dev              # http://localhost:5173
npm run build            # сборка в dist/
npm run preview          # проверка собранной версии
npm run typecheck        # проверка типов
```

Node 20+.

## Что где лежит

```
src/
├─ content/content.ts      ← ВСЕ ТЕКСТЫ, ЦИФРЫ, ФОРМАТЫ, 14 ИНСТРУМЕНТОВ
├─ styles/                 дизайн-система (токены приложения A ТЗ) и секции
│  ├─ tokens.css           цвета, шрифты, радиусы, светлая и тёмная темы
│  ├─ base.css             типографика, контейнер, reveal, reduced-motion
│  ├─ chrome.css           шапка, вертикальный рельс экранов, подвал
│  ├─ ui.css               кнопки, заголовки секций, карточки, бегущая строка
│  ├─ hero.css             первый экран, полоса показателей, запасная сцена
│  └─ sections.css         экраны 2–5, форма, служебные страницы
├─ components/
│  ├─ layout/              Header (sticky + прогресс прокрутки), Footer
│  ├─ sections/            Hero + PrototypeContent (разделы обновлённого прототипа)
│  ├─ three/               3D: SceneCanvas (условная загрузка), Scene, textures
│  ├─ form/                LeadForm, leadSchema (zod), submitLead
│  └─ ui/                  Reveal, Counter, Marquee, Icon, SectionHead, Logo
├─ hooks/                  useInView, useReducedMotion, useSectionTracking, useDocumentMeta
├─ lib/                    analytics, attribution (UTM), phone, config
└─ pages/                  Home, Thanks (/thanks), Privacy (/privacy), NotFound (404)
```

**Основные тексты меняются в `src/content/locales/ru.json` и `kg.json`**. Числа финансовой модели находятся в `PrototypeContent.tsx`, а декоративные 3D-карточки — в `content.ts` / `heroVisual.ts`.
Цифры форматов (`FORMATS`) — единый источник для вкладки, подписи кнопки и поля формы.

## Настройка перед публикацией (.env)

| Переменная | Зачем |
|---|---|
| `VITE_LEAD_ENDPOINT` | URL, куда уходит заявка. Пусто → открывается черновик WhatsApp, который отправляет посетитель |
| `VITE_CONTACT_WHATSAPP` / `TELEGRAM` / `INSTAGRAM` | строка «Или напишите:» показывается только для заполненных ссылок (раздел 8.5 ТЗ) |
| `VITE_GA4_ID`, `VITE_META_PIXEL_ID`, `VITE_YANDEX_METRIKA_ID` | аналитика; пусто → система не подключается |
| `VITE_SITE_URL` | канонический адрес для canonical и og:url |

Сами счётчики (gtag.js / fbq / ym) подключаются в `index.html` после согласия на cookie,
если этого потребует политика заказчика. Слой событий уже готов: `src/lib/analytics.ts`.

## Что сделано по ТЗ

* 5 экранов + шапка и подвал, тексты раздела 5 — дословно, с неразрывными дефисами (U+2011).
* Бренд-цвета приложения A (#0D09D5 / #83E40A / #12112A), светлая и тёмная темы
  (`prefers-color-scheme` + `data-theme`). Тёмная тема углублена до #06061A, первый
  экран и блок заявки тёмные в обеих темах — это осознанное отступление от прототипа.
* Счётчики (1.3 с, ease-out), reveal-появление с подстраховкой на 6 с, рост столбцов графика,
  переключатель форматов (tablist/tab/tabpanel + затухание 200 мс), бегущая строка на 60 с
  с паузой при наведении, FAQ на нативном `<details>`, покачивание карточек 7 / 8 / 9 с.
* Синхронизация: кнопка «Получить КП по формату …» подставляет формат в форму;
  изменение поля «Формат» (кроме «Пока не знаю») переключает вкладку.
* Форма: правила и тексты ошибок раздела 8.1, `aria-invalid` + `aria-describedby`,
  перевод фокуса на первое поле с ошибкой, honeypot, нормализация телефона (+996),
  сбор UTM и click-id на 30 дней, служебные данные (страница, referrer, время по Бишкеку, устройство).
* Аналитика: все события раздела 9 через один слой `track()`; персональные данные не уходят.
* SEO: title/description, Open Graph, canonical, schema.org Organization, `robots.txt`,
  `sitemap.xml`, манифест, иконки, страницы `/thanks`, `/privacy`, 404.
* Доступность: один H1, видимый фокус, цели от 44 px, поля 50 px и шрифт 16 px на мобильных,
  `prefers-reduced-motion` отключает анимации, контент виден без JS.

## 3D

`src/components/three/Scene.tsx` — две сцены на одном наборе примитивов:

* **hero** — «цифровой ландшафт» из ~5800 точек с волной (sin/cos), парящие
  стеклянные панели с кодом, диплом и зелёный стикер, каркасный икосаэдр,
  аддитивные пятна свечения, параллакс за курсором;
* **apply** — облегчённый вариант: ландшафт, свечение, каркас.

Зависимостей, кроме `three` и `@react-three/fiber`, нет: тексты панелей рисуются
на canvas 2D из того же `content.ts` (`textures.ts`), поэтому не нужны ни drei,
ни шрифтовые атласы, ни постпроцессинг.

Сцена — **прогрессивное улучшение**: отдельный чанк `three`, грузится только при
WebGL и выключенном `prefers-reduced-motion`, включая телефоны. На экранах до
1100 px карточки отображаются как HTML с чётким текстом и парящей CSS-анимацией
поверх 3D-фона. Частиц меньше, а плотность рендеринга фона ограничена 2.
WebGL-сцена приостанавливается вне экрана. На десктопе запасные карточки
скрываются только после загрузки текстур и первого кадра. Если WebGL упал,
`SceneBoundary` или обработчик потери контекста возвращает запасную вёрстку.
Запасная вёрстка (карточки с кодом) есть в разметке всегда — контент виден и без
WebGL, и без JS.

## Тексты и языки

Тексты из `it_adis_franchise_prototype_updated (1).html` перенесены без изменения
в `src/content/locales/ru.json` и `src/content/locales/kg.json` (137 ключей в каждом).
Переключатель RU / KG в шапке сохраняет выбор в localStorage. Для кыргызского языка
атрибут HTML `lang` установлен в `ky`. Основная страница собрана в `PrototypeContent.tsx`;
калькулятор считает паушальный взнос, стартовые инвестиции и дополнительный бюджет.

Без `VITE_LEAD_ENDPOINT` форма открывает подготовленный черновик WhatsApp на номер
+996 558 553 177. Сообщение отправляет сам посетитель. При настроенном endpoint форма
отправляет JSON, включая выбранный язык и бюджет, и переходит на `/thanks`.

## Vercel

The root `vercel.json` configures the Vite build, `dist` output, and SPA routing
so direct visits and refreshes on `/thanks` and `/privacy` work.

1. Push this project to your Git repository, including `package-lock.json` and `vercel.json`.
2. Import the repository into Vercel. Use the repository root as the Root Directory.
3. Use the Vite preset, Build Command `npm run build`, and Output Directory `dist`
   (already configured in `vercel.json`).
4. Add the required variables from `.env.example` in the project's Environment Variables:
   `VITE_SITE_URL` for the public site URL, `VITE_LEAD_ENDPOINT` for real lead submissions,
   and any contact links or analytics IDs you want enabled. Without a lead endpoint,
   the form opens a WhatsApp draft for the visitor to review and send.
5. Deploy. Redeploy after changing environment variables because Vite embeds them at build time.

Alternatively, run `npx vercel` from this directory to create a preview deployment,
then `npx vercel --prod` to publish production after checking the preview.

Variables prefixed with `VITE_` are public browser configuration; never put secret
API keys or bot tokens in them. Keep backend credentials on your lead endpoint's server.

## Деплой

Сборка статическая (`dist/`), нужен фолбэк на `index.html` для `/thanks`, `/privacy` и 404.

**nginx:**

```nginx
server {
    listen 443 ssl http2;
    server_name franchise.itadis.kg;
    root /var/www/itadis-franchise/dist;

    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
    location / { try_files $uri $uri/ /index.html; }
}
```

Редиректы с `http` и с `www` на основной домен — обязательны (раздел 10.1 ТЗ).

## Осталось получить от заказчика (раздел 12 ТЗ)

1. Контакты: телефон, ссылки WhatsApp / Telegram / Instagram → `.env`.
2. CRM и адрес уведомлений (e-mail и/или Telegram-бот) → эндпоинт заявки.
3. Домен, хостинг, доступы к DNS.
4. Идентификаторы GA4 / Meta Pixel / Яндекс.Метрики.
5. Текст политики обработки персональных данных → `src/pages/Privacy.tsx` (сейчас заглушка).
6. Подтверждение: цифровая платформа входит в пакет франшизы.
7. База расчёта роялти 30%.
8. Юридическая проверка формулировок про окупаемость и закреплённую территорию.
9. Подтверждение цифр: 3500+, 2000+, 5000 бесплатных мест, 10+ лет.
10. Реальные фото и кейсы партнёров.
11. География продаж и срок запуска точки.
12. Порядок отправки КП.
13. Макет og-картинки 1200×630 и логотип в векторе (SVG) — сейчас временные,
    собраны из растрового логотипа: `public/og.png`, `public/favicon.svg`.

Пункт 5 и пункт 13 блокируют публикацию: без текста политики и без векторного логотипа
сайт выкладывать нельзя.

## Шрифты

| Роль | Шрифт | Начертания |
|---|---|---|
| Заголовки | **Unbounded** | 700, 800 |
| Текст и интерфейс | **Inter Tight** | 400–800 + курсив 800 для акцентов |
| Метки, номера, код | **JetBrains Mono** | 500, 700 |

Подключены с Google Fonts с `display=swap` и `preconnect`. ТЗ называл Montserrat /
DM Sans: это honest-деталь для согласования с заказчиком — Montserrat выглядит
«как у всех», Unbounded + Inter Tight дают узнаваемую подачу и лучше ложатся на
угловатый знак логотипа. Вернуть шрифты из ТЗ — это три строки в
`src/styles/tokens.css` (`--font-display`, `--font-body`) и `<link>` в `index.html`.

Перед публикацией шрифты стоит положить на свой хостинг (subset: кириллица +
латиница): минус сторонний запрос и плюс к Lighthouse.

## Логотип

`src/assets/logo.webp` — локап (знак + «ITADIS»), вырезан из присланного растра с
прозрачным фоном: работает и на тёмном, и на светлом фоне без белой плашки.
`public/logo-mark.png` — только знак, из него собраны фавиконки и `og.png`.
Когда заказчик пришлёт вектор (SVG), заменить эти файлы — разметка не меняется.
