Install TailwindCSS & daisyUI

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

-> This creates tailwind.config.js and postcss.config.js

Install daisyUI:

npm install daisyui

## Configure Tailwind + daisyUI

    Edit tailwind.config.js

    ```js
    /** @type {import('tailwindcss').Config} */
        module.exports = {
        content: [
            "./views/**/*.{ejs,html}",  // Tailwind scans these files
            "./public/**/*.js"
        ],
        theme: {
            extend: {},
        },
        plugins: [require('daisyui')],
        }

    ```

## modify css file

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

## Build Tailwind CSS

    npx tailwindcss -i ./public/css/main.css -o ./public/css/output.css --watch

    This compiles main.css → output.css with Tailwind classes applied

Use output.css in your HTML:

    <link rel="stylesheet" href="/css/output.css">

## Use Tailwind + daisyUI classes

```html
    <div class="grid grid-cols-3 gap-4 p-4">
  <div class="bg-base-200 border rounded-lg flex items-center justify-center font-bold cursor-pointer hover:bg-base-300">Table 1</div>
```

## Optional: Button styles with daisyUI

    ```html
    <button class="btn btn-primary">Start Order</button>
    <button class="btn btn-secondary">Clear</button>

    ```





