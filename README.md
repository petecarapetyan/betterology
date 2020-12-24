# rocket-template
Template for starting out a rocket SSG project, pete-style

## stuff I did to create this

- started out with project created in github new project wizard
  - chose MIT for license
  - chose Node for .gitignore
  - chose Add a README file
- git cloned into my local
- followed instructions on Rocket Getting Started guide:
  - `npm install --save-dev @d4kmor/cli @d4kmor/launch`
  - added contents to .gitignore
  - created rocket.config.mjs file with appropriate contents
  - created docs/index.md
- copied _merged... files into docs
  - renamed by removing merged from name
  - inspected each file manually and made changes
    - practically everything in `docs/_data/site.cjs`
- replaced 'rocket' with 'yada' wherever appropriate

## TODO:

- see waw README
- see site url .cjs netlify stuff for how to integrate that
- how does dark mode work?
- separate sections on deployments to 
   - netlify
   - firebase
   - straight scp
   - github actions
- string search list:
   - yada
   - foo
   - bar
   - [css vars]
- images
   - various icons++
   - social media image
   - `summary_large_image`
