const { pathname, search } = window.location;
const distPath = pathname.substring(0, pathname.lastIndexOf("/"));
const appPath = distPath.slice(0, distPath.lastIndexOf("/"));
const templateAppPath = appPath.slice(0, appPath.lastIndexOf("/"));
const localeUrlParamRegex = /locale=([\w-]+)/;
const dojoLocale = search.match(localeUrlParamRegex) ? RegExp.$1 : undefined;

window["dojoConfig"] = {
  async: true,
  locale: dojoLocale,
  packages: [
    {
      name: "widgets",
      location: `${distPath}/dist/app/js/widgets`
    }
    // {
    //   name: "resources",
    //   location: locationPath + "dist/app/js/widgets/SearchConfig/nls/resources"
    // }
  ]
};
