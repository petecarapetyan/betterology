import eleventyNavigationPlugin from "@11ty/eleventy-navigation";

export default async function(eleventyConfig) {
  eleventyConfig.setInputDirectory("site");
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPassthroughCopy("static");

  // EVERYTHING BELOW IS FOR THE DRAFT FUNCTIONALITY
  // 1. Global Computed Permalink
  // If draft is true & we are building (not serving), kill the permalink.
  eleventyConfig.addGlobalData("eleventyComputed.permalink", () => {
    return (data) => {
      // Always render drafts during 'npx @11ty/eleventy --serve'
      if (process.env.ELEVENTY_RUN_MODE === "serve") {
        return data.permalink;
      }
      // Otherwise, if marked draft, return false (no file output)
      if (data.draft) {
        return false;
      }
      // Default behavior: return the existing permalink (or undefined)
      return data.permalink;
    };
  });

  // 2. Global Computed Exclusion
  // If draft is true & we are building, hide from collections.
  eleventyConfig.addGlobalData("eleventyComputed.eleventyExcludeFromCollections", () => {
    return (data) => {
      if (process.env.ELEVENTY_RUN_MODE === "serve") {
        return data.eleventyExcludeFromCollections;
      }
      if (data.draft) {
        return true;
      }
      return data.eleventyExcludeFromCollections;
    };
  });
};