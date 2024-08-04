---
title: Overview
layout: default
nav_order: 1
---

# IndEcx Documentation
{: .fs-9 }

These documentation provides details and description of the code used for building the IndEcx web app as well as instructions on how to edit and achieve certain editing goals.
{: .fs-6 .fw-300 }

[View the website][Indecx website]{: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[View it on GitHub][Indecx repo]{: .btn .fs-5 .mb-4 .mb-md-0 }

---

## IndEcX 
Industrial Ecology Projects Database : Aimed to facilitate storage, access, and retrieval of the different projects created by the Industrial Ecology Group at NTNU.

## Basic Structure
The code for the IndEcX is divided into:
- backend: responsible for creating the database and serving it as an API
- data: where the database file, and uploaded files are stored
- frontend: responsible for creating the website where the database is accessed from
- production files (no specific folder for them): these are the files responsible for creating the servers to serve the previous parts and combining them into a docker container


[Jekyll]: https://jekyllrb.com
[Markdown]: https://daringfireball.net/projects/markdown/
[Liquid]: https://github.com/Shopify/liquid/wiki
[Front matter]: https://jekyllrb.com/docs/front-matter/
[Jekyll configuration]: https://jekyllrb.com/docs/configuration/
[source file for this page]: https://github.com/just-the-docs/just-the-docs/blob/main/index.md
[Just the Docs Template]: https://just-the-docs.github.io/just-the-docs-template/
[Just the Docs]: https://just-the-docs.com
[Just the Docs README]: https://github.com/just-the-docs/just-the-docs/blob/main/README.md
[GitHub Pages]: https://pages.github.com/
[Template README]: https://github.com/just-the-docs/just-the-docs-template/blob/main/README.md
[GitHub Pages / Actions workflow]: https://github.blog/changelog/2022-07-27-github-pages-custom-github-actions-workflows-beta/
[use the template]: https://github.com/just-the-docs/just-the-docs-template/generate

[Indecx website]: https://indecx.indecol.no/
[Indecx repo]: https://github.com/NTNU-IndEcol/IndEcX