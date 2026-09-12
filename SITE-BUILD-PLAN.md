# Site build exercise

Goal: make site changes in one place, then generate a complete `public/` directory. Implement this myself; use assistance for hints and review.

Paths below are relative to the project root, where this checklist lives.

## Decisions before implementation

- [x] Choose source locations: TypeScript in `src/`; handwritten HTML, CSS, and images in `static/`.
- [x] Preserve handwritten site files in `static/` before treating `public/` as generated output.
- [x] Define the build command: `npm run build` runs cleanup, copies static files, and compiles TypeScript.
- [x] Decide the layout's initial inputs: page title and body are enough to start.
- [x] Decide how templates will be rendered and how plain text values will be escaped separately from intentional HTML content.
- [x] Preserve the existing output paths: `/pages/`, `/css/`, `/assets/`, and `/js/`.
- [x] Decide which shared elements belong on every page, including navigation and footer.

## Implementation milestones

### 1. Reproducible output

- [x] Move handwritten HTML, CSS, and images into `static/`.
- [x] Build by clearing old generated output, copying unchanged files, and compiling TypeScript.
- [x] Propagate cleanup failures through the npm prebuild hook and chain build steps with `&&`.
- [x] Ignore `public/` and `node_modules/`; generated `public/` files are not tracked.
- [x] Verify a fresh build without `public/`: static files match their sources and browser TypeScript compiles. Navigation has since moved to build-time HTML generation.
- [x] Verify stale output is removed on rebuild using a temporary output-only page.

Verification: fresh build and rebuild passed in a temporary copy. Browser checks remain in milestone 5.

- [ ] Ensure source files, scripts, and package configuration are tracked before verifying a clean checkout.
- [ ] Optional: reject `static/js/` to enforce exclusive TypeScript ownership of `public/js/`.

### 2. Shared page layout

- [x] Extract the document structure, head, stylesheet reference, navigation hookup, and content container into one layout.
- [x] Render the homepage and projects page with that layout first.
- [x] Verify that one shared layout edit appears on both pages after rebuilding.
- [x] Apply the layout to remaining pages.
- [x] Consider generating navigation HTML at build time using the existing route data.

### 3. Shared project data (deferred)

- [ ] Store project names, descriptions, and links in one collection.
- [ ] Decide how the homepage selects and orders recent projects.
- [ ] Generate both the homepage selection and full projects list from that collection.
- [ ] Verify that changing a project link updates both places. SJSU Bark currently has a source URL on the homepage but no URL on the projects page.

### 4. Blog content and metadata

- [ ] Store each post's title and date alongside its body, with a stable output path or slug.
- [ ] Generate the homepage blog list and blog index from the posts' metadata.
- [ ] Define post ordering and date display consistently.
- [ ] Verify that adding one post produces its page and its list entries without editing those lists manually.
- [ ] Keep HTML bodies initially; consider Markdown later if it improves writing.

### 5. Docker and local workflow

- [ ] Add an asset build stage with Node to the Docker build.
- [ ] Keep the Go compilation stage; asset generation and Go compilation can happen independently because the server reads `public/` at runtime.
- [ ] Assemble the final image from the compiled server and generated `public/`; reconsider the current final `COPY . .`.
- [ ] Verify that a clean checkout can build the image without a locally generated `public/`.
- [ ] Check the homepage, nested pages, navigation, images, styles, and scripts through the Go server.
- [ ] Add file watching once the one-command build works reliably.

## Current progress and next exercise

Shared layout milestone complete. All four pages are generated from `src/pages/` and the shared template; `static/` now contains CSS and assets. The renderer uses jsdom, `textContent` for titles, and `innerHTML` for page bodies. Navigation is generated from one route collection, and the footer is inside the template body.

Verification: a full build in a temporary copy passed. All four outputs contain their configured titles, page content, and three navigation links, with no runtime scripts. A temporary shared layout edit appeared on all four pages. The user reports styling looks good; automated browser visual checks were not performed.

Shared project data is deferred by user preference. Next priority is to be selected; remaining options include Docker build integration, local watch/preview workflow, and blog metadata.
