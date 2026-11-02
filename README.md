# daffodils

An animated daffodil bouquet built with plain HTML, CSS, and JavaScript.

## Credits

The base flower animation comes from [naveen-kumawat/Flower](https://github.com/naveen-kumawat/Flower).
This project started as a rose version of it and now grows daffodils instead.

## Running locally

There is no build step.
Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Editing styles

Styles are written in `style.scss` and compiled to `style.css`.
After editing the SCSS, recompile with:

```
npx sass --watch style.scss style.css
```

## Project layout

- `index.html` - page markup and inline styles
- `daffodils.js` - the list of flowers; edit this to rearrange the bouquet
- `daffodils.css` - styles and animation for the bouquet
- `assets/daffodils/` - the cut-out flower heads
- `tools/extract_heads.py` - cuts heads out of a sheet of flowers on black
- `style.scss` - source styles
- `style.css` / `style.css.map` - compiled styles
- `main.js` - removes the `not-loaded` class after page load to start the animation
- `dev-controls.js` - optional Tweakpane GUI for tuning petal positions
  Not loaded by default.
  To use it, add `<script src="dev-controls.js"></script>` to `index.html`, then use "Export CSS" to copy values into `style.css`.
  Remove it when finished.
