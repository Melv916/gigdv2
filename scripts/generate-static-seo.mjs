import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const siteFilePath = resolve("src/lib/site.ts");
const robotsPath = resolve("public/robots.txt");
const sitemapPath = resolve("public/sitemap.xml");

const siteFile = readFileSync(siteFilePath, "utf8");

function extractStringConstant(source, constantName) {
  const match = source.match(new RegExp(`export const ${constantName} = "([^"]+)";`));
  if (!match) {
    throw new Error(`Unable to find string constant ${constantName} in ${siteFilePath}`);
  }

  return match[1];
}

function extractStringArray(source, constantName) {
  const match = source.match(new RegExp(`export const ${constantName} = \\[((?:.|\\r|\\n)*?)\\];`));
  if (!match) {
    throw new Error(`Unable to find array constant ${constantName} in ${siteFilePath}`);
  }

  return [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
}

const siteUrl = extractStringConstant(siteFile, "SITE_URL").replace(/\/$/, "");
const sitemapPaths = [...new Set(extractStringArray(siteFile, "sitemapSitePaths"))];

const sitemapXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapPaths.map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`),
  "</urlset>",
  "",
].join("\n");

const robotsTxt = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /app",
  "Disallow: /auth",
  "",
  `Sitemap: ${siteUrl}/sitemap.xml`,
  "",
].join("\n");

writeFileSync(sitemapPath, sitemapXml, "utf8");
writeFileSync(robotsPath, robotsTxt, "utf8");

console.log(`Generated ${sitemapPath} and ${robotsPath} from ${siteFilePath}`);
