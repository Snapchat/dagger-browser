/**
 * Configuration class based on input Config.json
 */

import data from "src/Config.json";

interface Config {
  // Title of the page
  TITLE: string;
  // Url to the code in github repo
  REPO_URL?: string;
  // Public Url
  PUBLIC_URL: string;
  // Components manifest url
  COMPONENTS_MANIFEST_JSON_URL: string;
  // Components manifest gzip url (handle both unzipped and gzipped cases)
  COMPONENTS_MANIFEST_GZIP_URL: string;
}

export default {
  TITLE: data.title || "Graph Browser",
  REPO_URL: data.repo_url || "",
  PUBLIC_URL: process.env.PUBLIC_URL || "",
  COMPONENTS_MANIFEST_JSON_URL: (process.env.PUBLIC_URL || "") + '/ComponentsManifest.json',
  COMPONENTS_MANIFEST_GZIP_URL: (process.env.PUBLIC_URL || "") + '/ComponentsManifest.json.gz'
} as Config;
