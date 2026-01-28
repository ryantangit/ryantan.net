const NavRoutes = [
  { href: "/", label: "Ryan Tan" },
  { href: "/pages/projects.html", label: "Projects" },
  { href: "/pages/blogs.html", label: "Blogs" },
];
function navbar() {
  const navbarContainer = document.getElementById("navbar-container");
  if (!navbarContainer) {
    console.error(
      "document.getElementById(navbar-container) did not return a valid element",
    );
  }
  const navigation = document.createElement("nav");
  const navbarList = document.createElement("ul");
  navbarList.className = "navbar-list";
  navigation.appendChild(navbarList);
  NavRoutes.forEach((route) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = route.href;
    a.textContent = route.label;
    li.appendChild(a);
    navbarList.appendChild(li);
  });
  navbarContainer.appendChild(navigation);
}
navbar();
