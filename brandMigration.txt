# make this runnable, remove the numbers, check out a previous that has old_docs, etc
# you have to start with a migration2025 branch to have the old_docs etc to migrate froms
# - if you get lost and need old files back, checkout the migration2025 branch

rm -rf site/nulla-nisi
rm -rf site/occaecat
rm -rf site/pariatur
rm -rf site/index.md
rm rf site/sitemap.njk
mv old_docs/content site
mv old_docs/packages site
mv old_docs/pre2015 site
mv old_docs/index.md site
mv mv old_docs/about site
mv old_docs/sitemap.njk site
rm static/logo.svg
rm -rf extra
rm -rf _site-dev
#  remove images using separate python script /Users/petecarapetyan/work/appwriter2035/sites/ImageCleanupUtility.py
rm -rf site/_includes/_joiningBlocks/_layoutHome/ 
rm -rf site/_includes/_joiningBlocks/content
rm -rf site/_includes/_joiningBlocks/_layoutIndex/content
rm -rf site/_includes/_joiningBlocks/_layoutIndex/content
rm -rf site/_includes/_joiningBlocks/_layoutSidebar/
rm -rf site/_includes/_joiningBlocks/bottom         
rm -rf site/_includes/_joiningBlocks/footer 
rm -rf site/_includes/_joiningBlocks/head
rm -rf site/_includes/_joiningBlocks/header 
rm -rf site/_includes/partials             
rm site/_includes/snippet/header-dark-switch.njk
rm site/_includes/snippet/header-logo.njk
rm static/images/bulksplash-*.jpg
rm site/_includes/layout-simulator.njk
rm site/_includes/layout-home-background.njk

# no favicon was found pertaining to datafundamentals
# hand copy this into the theme.css
# ```

# .copyright {
#   display: grid;
#   justify-content: center;
#   align-items: center;
#   font-size: 9px;
# }

# .socials {
#   display: flex;
#   flex-flow: row;
#   align-items: center;
#   justify-content: center;
# }

# .social-link {
#   display: block;
#   width: 30px;
#   height: 30px;
# }

# .logo-link img {
#   width: 250px;
#   height: 42px;
#   vertical-align:auto;
# }
# ```

# after manually copying in the image
# replaced site/_includes/snippet/header-logo-background.njk with 
```
<a class="logo-link" href="{{ '/' | url }}">
	<img src="/static/images/datafundamentals250simplici.gif" />
	<span class="sr-only">{{ site.name }}</span>
</a>
```

# manually made all relevant changes in site/_data/site.cjs

# all of the content needs to be updated as it is very old and not relevant

