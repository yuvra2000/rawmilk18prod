# Managing SCSS and Theme Variables

This document explains how SCSS compiling and theme variables work in this Angular template, and what you need to do when you make changes.

## How the Theme Uses Styling

In this template, the styling architecture works like this:
1. All core variable files, Bootstrap overrides, and custom theme logic live inside `public/assets/scss/`.
2. The Angular build builder (`angular.json`) is configured to load the **pre-compiled CSS** files from `public/assets/css/` rather than the raw `.scss` directly.
3. This is done because directly importing the raw SCSS via Angular's modern builder causes resolution issues with the theme's image asset paths. 

Because Angular loads the compiled CSS, any changes you make to the `.scss` files will **not** be automatically reflected in the browser—they must be compiled first!

## Making Changes to Variables (e.g. `_variables.scss`)

If you want to change the primary color, dark mode colors, fonts, or other Bootstrap settings:

1. Open `public/assets/scss/_variables.scss`.
2. Make your edits (e.g. changing `--primary-rgb: 47, 64, 80;`).
3. Save the file.
4. **Compile the SCSS into CSS using the built-in script!** (See next section)

## The Compilation Command: `npm run sass`

Whenever you make a change to *any* file inside `public/assets/scss/`, you must tell the project to recompile those SCSS files into the `public/assets/css/` folder so Angular can see your changes.

The template author provided a specific NPM script in `package.json` for exactly this purpose: `npm run sass`.

### Workflow to Update Styles

1. Kill your running Angular server (`Ctrl + C` in the terminal).
2. Run the SCSS compiler:
   ```bash
   npm run sass
   ```
   *(This command executes `sass ./public/assets/scss:./public/assets/css/`)*
3. Wait for it to finish (it should take less than a second). Your new CSS files are now ready!
4. Restart your Angular development server:
   ```bash
   npm start
   ```

### Quick Reference

* **Where do I change colors?** -> `public/assets/scss/_variables.scss`
* **How do I apply those changes?** -> Run `npm run sass` then `npm start`
* **Why did my images break before?** -> Angular's SCSS compiler doesn't handle the custom asset paths in the theme smoothly, which is why we rely on the `npm run sass` script provided by the theme builder. 
