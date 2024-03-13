# Shopify Recommended Products Module

Demo: [https://yo-ka-store.myshopify.com/collections/all](https://yo-ka-store.myshopify.com/collections/all)

## Spis treści
1. [Opis](#Opis)
2. [Wymagania](#Wymagania)
3. [Development](#Development)
4. [Integracja](#Integracja)
5. [Zarządzanie](#Zarządzanie)

## Opis

Moduł do produktów rekomendowanych dla szablonów dedykowanych silnikowi Shopify. 

W skład modułu wchodzą:
* pliki TS & SCSS - `modules/recommended-products`
* sekcja recommended-products - `sections/recommended-products.liquid`
* konfiguracja Webpack - `webpack.config.js`
* konfiguracja TypeScript - `tsconfig.json`

Zbundlowany kod modułu wraz z skryptem JS oraz plikami CSS generuje się automatycznie i trafia do folderu `assets` jako:
*  `assets/recommended-products.js` skrypt inicjujący slider do sekcji
* `assets/recommended-products.css` plik agregujące style potrzebne do wyświetlenia sekcji

## Wymagania

* Node 20.* (LTS)
* yarn 
* [Shopify CLI](https://shopify.dev/docs/themes/tools/cli/install)
* Konto w [Shopify Partners](https://www.shopify.com/partners) + utworzony sklep z zaimportowanymi produktami np. [przykładowe produkty](https://github.com/shopifypartners/product-csvs)

## Development
Instalujemy zależności
```bash
yarn install
```

Odpalamy projekt
```bash
yarn dev
```

## Integracja

Aby zintegrować moduł z nowym szablonem Shopify należy:

#### 1. Skonfigurować projekt
##### 1.1 Inicjalizujemy nowy projekt (tylko jeżeli go nie mamy zainicjalizowanego)
```bash
npm init
```
##### 1.2 Dodajemy wymagane paczki
```bash
yarn add --dev @types/swiper concurrently css-loader mini-css-extract-plugin node-sass sass-loader swiper ts-loader typescript webpack webpack-cli
```

##### 1.3 Tworzymy plik konfiguracyjny Webpack
```typescript
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        "recommended-products": "./modules/recommended-products/"
    },
    output: {
        path: path.resolve(__dirname, './assets'),
        filename: '[name].js'
      },
    resolve: {
        extensions: ['.ts', '.scss'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: '[name].css' })
    ]
};

```
##### 1.4 Tworzymy plik konfiguracyjny TypeScript
```json
{
    "compilerOptions": {
      "outDir": "./assets/",
      "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
    },
    "include": ["./modules/**/*"],
    "exclude": ["node_modules"]
  }
  
```
#### 2 Kopiujemy pliki z modułem
```bash
cp -R modules/recommended-products [nasza lokalizacja projektu]/modules
```

#### 3 Kopiujemy pliki z sekcją
```bash
cp sections/recommended-products.liquid [nasza lokalizacja projektu]/sections
```

#### 4 Dodajemy sekcję do naszego miejsca docelowego

## Zarządzanie
 Slider produktów wykorzystuje zdefiniowaną logikę, aby wyświetlać odpowiednie produkty z danego typu, które najlepiej się sprzedają oraz daje moliwość doszczegółowienia filtrowania na bazie tagów i kolekcji bieżącego produktu. Slider ma za zadanie polepszyć doświadczenia użytkownika poprzez rekomendowanie produktów powiązanych lub podobnych do oglądanego.

### 1. Szczegóły konfiguracyjne niezbędne do zarządzania sliderem

Sekcja ta oferuje następujące opcje konfiguracji:

#### 1. Tytuł Sekcji
- **Typ**: Tekst
- **ID**: `title`
- **Etykieta**: Title of section (Tytuł sekcji)
- **Domyślnie**: Polecane dla Ciebie
- **Opis**: Pozwala na określenie tytułu sekcji, który będzie wyświetlany na stronie.

#### 2. Etykieta Przycisku
- **Typ**: Tekst
- **ID**: `button_label`
- **Etykieta**: Button label of section (Etykieta przycisku sekcji)
- **Domyślnie**: Zobacz wszystkie
- **Opis**: Pozwala na określenie tekstu przycisku, który przekierowuje użytkownika do strony z wszystkimi rekomendowanymi produktami.

#### 3. Filtr
- **Typ**: Wybór
- **ID**: `filter`
- **Etykieta**: Filter by (Filtruj według)
- **Opcje**: By collection (Według kolekcji), By tags (Według tagów), default (domyślny)
- **Domyślnie**: default
- **Opis**: Umożliwia wybór metody filtracji produktów: według kolekcji, tagów lub bez filtrowania (opcja domyślna).

#### 4. Limit Elementów Slidera
- **Typ**: Zakres
- **ID**: `limit`
- **Min**: 2
- **Max**: 20
- **Krok**: 2
- **Etykieta**: Slider element limit (Limit elementów slidera)
- **Domyślnie**: 10
- **Opis**: Określa maksymalną liczbę produktów do wyświetlenia w sliderze. Możliwa wartość to od 2 do 20, zwiększając co 2 produkty.


### 2. Logika wyboru produktów do slidera
1. **Określenie Kontekstu Produktu**
   - Pobieramy typ bieżącego produktu (`current_product_type`).
   - Zbieramy tagi (`current_product_tags`) i kolekcje (`current_product_collections`) bieżącego produktu.

2. **Filtracja Produktów**
   - Pobieramy wszystkie produkty (`collectionOfProducts`) i filtrujemy je według typu produktu. Lista jest sortowana według najlepiej sprzedających się produktów.
   - Ustawiamy limit produktów (`product_limit`), który określa maksymalną liczbę produktów do wyświetlenia w sliderze.

3. **Iteracja i Dobór Produktów**
   - Dla każdego produktu z filtrowanej listy:
     - Sprawdzamy, czy nie przekroczono limitu produktów (`product_count >= product_limit`).
     - Wykluczamy bieżący produkt z listy.

4. **Warunki Wyboru**
   - Sprawdzamy, czy produkt pasuje do jednego z następujących kryteriów:
     - Ma wspólny tag z bieżącym produktem (`shared_tag_found`).
     - Należy do tej samej kolekcji co bieżący produkt (`shared_collection_found`).
     - Opcja domyślna (`section.settings.filter == 'default'`), jeśli nie zastosowano filtrów.

5. **Budowanie Listy Finalnej Produktów**
   - Jeśli produkt spełnia któreś z powyższych kryteriów, dodajemy go do listy `filtered_products`.
   - Zwiększamy licznik znalezionych produktów (`product_count`).

6. **Prezentacja Wyników**
   - Tworzymy listę handle'ów produktów (`filtered_product_handles`) do wyświetlenia w sliderze.


