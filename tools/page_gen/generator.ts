import { pageRoutesConfig, navRoutesConfig } from "./config.js";
import { JSDOM } from "jsdom";
import fs from "node:fs/promises";
import { dirname } from "node:path";

function navbar(document: Document) {
  const navbarContainer = document.getElementById("navbar-container");
  if (!navbarContainer) {
    throw new Error(
      "document.getElementById(navbar-container) did not return a valid element, navbar hydration failed",
    );
  }
  const navigation = document.createElement("nav");
  const navbarList = document.createElement("ul");
  navbarList.className = "navbar-list";
  navigation.appendChild(navbarList);
  navRoutesConfig.forEach((route) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = route.href;
    a.textContent = route.label;
    li.appendChild(a);
    navbarList.appendChild(li);
  });
  navbarContainer.appendChild(navigation);
}

async function generate() {
  // Route through each page route meta and perform the injection
  for (const meta of pageRoutesConfig) {
    const templateDom = await JSDOM.fromFile(meta.templateMeta.templateFile);
    const document = templateDom.window.document;
    navbar(document);
    const titleEl = document.querySelector("#_page_title");
    if (!titleEl) {
      throw new Error("Title Element not found, cannot hydrate");
    }
    titleEl.textContent = meta.templateMeta.title;
    const bodyEl = document.querySelector("#_page_body");
    if (!bodyEl) {
      throw new Error("Body Element not found, cannot hydrate");
    }
    const inDom = await JSDOM.fromFile(meta.inFile);
    bodyEl.innerHTML = inDom.window.document.body.innerHTML;
    const content = templateDom.serialize();
    const outdir = dirname(meta.outFile);
    await fs.mkdir(outdir, { recursive: true });
    await fs.writeFile(meta.outFile, content);
  }
}

await generate();
