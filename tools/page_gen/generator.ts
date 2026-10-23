import { pageRoutesConfig, blogPostsConfig ,navRoutesConfig, templateFilePath, projectMeta } from "./config.js";
import { JSDOM } from "jsdom";
import fs from "node:fs/promises";
import { dirname } from "node:path";

// Inject the navbar onto the specified document
function injectNavbar(document: Document) {
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
};

function injectBlogList(document: Document) {
  const listContainer = document.getElementById("blog-lists");
  if (!listContainer) {
    return;
  }
  const fullList = listContainer.hasAttribute("data-blog-list-all");
  let blogList = [...blogPostsConfig];
  const NUM_OF_BLOGS_SHORTLIST = 5;
  if (!fullList) {
    blogList = blogList.slice(0, NUM_OF_BLOGS_SHORTLIST);
  }
  blogList.forEach((blog) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = blog.outFile.slice(blog.outFile.indexOf("/"));
    a.textContent = `(${blog.date}) ${blog.templateMeta.title}`;
    li.appendChild(a);
    listContainer.append(li);
  });
};

function injectProjectList(document: Document) {
  const listContainer = document.getElementById("project-list");
  if (!listContainer) {
    return;
  }
  projectMeta.forEach((project) => {
    const li = document.createElement("li");
    const titleP = document.createElement("p");
    titleP.textContent = project.title;
    if (project.hostUrl) {
      const hostUrlA = document.createElement("a");
      hostUrlA.href = project.hostUrl;
      hostUrlA.target = "_blank";
      hostUrlA.rel = "nonopener";
      hostUrlA.textContent =" (Link)"
      titleP.appendChild(hostUrlA);
    }
    li.appendChild(titleP);
    const descriptionP = document.createElement("p");
    descriptionP.textContent = project.description;
    const sourceA = document.createElement("a");
    sourceA.href = project.sourceCodeUrl;
    sourceA.target = "_blank";
    sourceA.rel = "nonopener";
    sourceA.textContent = " (Source)"
    descriptionP.appendChild(sourceA);
    li.appendChild(descriptionP);
    listContainer.appendChild(li);
  });
}

async function generate() {
  // Route through each page route meta and perform the injection
  const pageConfigs = [...pageRoutesConfig, ...blogPostsConfig];
  for (const meta of pageConfigs) {
    const templateDom = await JSDOM.fromFile(meta.templateMeta.templateFile);
    const document = templateDom.window.document;
    injectNavbar(document);
    const titleEl = document.querySelector("#_page_title");
    if (!titleEl) {
      throw new Error("Title Element not found, cannot hydrate");
    }
    titleEl.textContent = meta.templateMeta.title;
    const bodyEl = document.querySelector("#_page_body");
    if (!bodyEl) {
      throw new Error("Body Element not found, cannot hydrate");
    }
    if (meta.templateMeta.templateFile === templateFilePath.BLOG) {
      const dateEl = document.querySelector("#_page_date");
      if (!dateEl) {
        throw new Error("Date Element not found, cannot hydrate");
      }
      if ("date" in meta && typeof meta.date === "string") {
        dateEl.textContent = meta.date;
      }
      const blogTitleEl = document.querySelector("#_blog_title");
      if (!blogTitleEl) {
        throw new Error("Blog Element not found, cannot hydrate");
      }
      blogTitleEl.textContent = meta.templateMeta.title;
    }
    const inDom = await JSDOM.fromFile(meta.inFile);
    bodyEl.innerHTML = inDom.window.document.body.innerHTML;
    injectBlogList(document);
    injectProjectList(document);
    const content = templateDom.serialize();
    const outdir = dirname(meta.outFile);
    await fs.mkdir(outdir, { recursive: true });
    await fs.writeFile(meta.outFile, content);
  }
}

await generate();
