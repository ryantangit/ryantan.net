type TemplateMeta = {
  title: string;
  templateFile: string;
};

type PageRouteMeta = {
  inFile: string;
  outFile: string;
  templateMeta: TemplateMeta;
};

type BlogPostMeta = PageRouteMeta & {
    date: string;
}


export const templateFilePath = {
  BASIC: "src/template/basic.html",
  BLOG: "src/template/blog.html",
} as const satisfies Record<string, string>;

export const pageRoutesConfig: PageRouteMeta[] = [
  {
    inFile: "src/pages/index.html",
    outFile: "public/index.html",
    templateMeta: { title: "Ryan Tan", templateFile: templateFilePath.BASIC },
  },
  {
    inFile: "src/pages/projects.html",
    outFile: "public/pages/projects.html",
    templateMeta: { title: "Projects", templateFile: templateFilePath.BASIC },
  },
  {
    inFile: "src/pages/blogs.html",
    outFile: "public/pages/blogs.html",
    templateMeta: { title: "Blogs", templateFile: templateFilePath.BASIC },
  },
];

export const blogPostsConfig: BlogPostMeta[] = [{
  date: "2025-05-17",
  inFile: "src/pages/blogs/nowb4tmrw.html",
  outFile: "public/pages/blogs/nowb4tmrw.html",
  templateMeta: {
    title: "Now Is Now, Before Was Before, And Tomorrow Who Knows?",
    templateFile: templateFilePath.BLOG
  },
},
];
blogPostsConfig.sort((a, b) => (
  b.date.localeCompare(a.date))
);

/**
 * Navroute for the navigation bar that is up top.
 */
type NavRoute = {
  href: string;
  label: string;
};

export const navRoutesConfig: NavRoute[] = [
  { href: "/", label: "Ryan Tan" },
  { href: "/pages/projects.html", label: "Projects" },
  { href: "/pages/blogs.html", label: "Blogs" },
];
