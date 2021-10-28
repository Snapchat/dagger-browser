/**
 * Configuration class based on input Config.json
 */


interface Config {
  // Title of the page
  TITLE: string;
  // Url to the code in github repo
  REPO_URL?: string;
  // Public Url
  PUBLIC_URL: string;
  // Components manifest url
  COMPONENTS_MANIFEST_JSON_URL: string;
}

export default {
  TITLE: "Dagger Browser" || "Graph Browser",
  REPO_URL: "" || "",
  PUBLIC_URL: process.env.PUBLIC_URL || "",
  COMPONENTS_MANIFEST_JSON_URL: (process.env.PUBLIC_URL || "") + '/ComponentsManifest.json'
} as Config;