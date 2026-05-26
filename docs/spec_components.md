# Спецификация Premium UI Компонентов

## 1. Cinematic Hero Section
- **Layout:** Full-screen (`100vh`).
- **Background:** HTML5 Video (muted, loop, cover) с темным градиентным виньетированием.
- **Typography:** Огромный H1 "93 ОПТБ". Использовать typing effect или glitch effect.
- **Motion:** Использовать GSAP ScrollTrigger. При начале скролла Hero-блок должен медленно уходить в blur и scale down.

## 2. Vacancy Cards (Bento Grid Style)
- **Layout:** Использовать асимметричный Bento Grid, а не скучные одинаковые карточки.
- **UI:** Glassmorphism (тонкий полупрозрачный фон, blur, `border-[#222]`). 
- **Elements:**
  - Верхний правый угол: неоновый тег (например: "Бойова", "Штаб").
  - Нижний правый угол: требования мелким `Roboto Mono`.
- **Hover Motion:** Framer Motion `whileHover`. Карточка немного увеличивается, граница подсвечивается неоновым `#ff5a00`.

## 3. Recruiting Form (shadcn/ui)
- **UI:** Максимально чистая. Инпуты без видимых границ по умолчанию, граница (оранжевая) появляется только при `focus`.
- **Fields:** ПІБ, Телефон, Вік, Посада (select), Досвід (radio-group).
- **Validation:** Мгновенная валидация Zod с красивым появлением текста ошибки (красный/оранжевый).
- **Motion:** Кнопка "Відгукнутися" должна иметь shimmer effect (`frontend-magic-ui`).

## 4. Equipment Showcase
- **Motion:** Использовать Locomotive/Lenis parallax. Картинки оружия должны двигаться с разной скоростью относительно текста при скролле.