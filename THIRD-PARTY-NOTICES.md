# Third-party notices

Stagehand uses the following third-party packages in `@stagehand/plan-schema`
and `@stagehand/plan-engine`. Dependency versions and licences below reflect
the resolved dependency tree in `package-lock.json`.

## Ajv and dependencies

| Package | Version | Licence | Copyright / attribution |
| --- | --- | --- | --- |
| `ajv` | 8.20.0 | MIT | Copyright (c) 2015-2021 Evgeny Poberezkin |
| `fast-deep-equal` | 3.1.3 | MIT | Copyright (c) 2017 Evgeny Poberezkin |
| `fast-uri` | 3.1.9 | BSD-3-Clause | Copyright (c) 2011-2021 Gary Court; Copyright (c) 2021-present The Fastify team |
| `json-schema-traverse` | 1.0.0 | MIT | Copyright (c) 2017 Evgeny Poberezkin |
| `require-from-string` | 2.0.2 | MIT | Copyright (c) Vsevolod Strukchinsky <floatdrop@gmail.com> (github.com/floatdrop) |

## Plan-engine development-only types

These packages provide TypeScript declarations for the Node.js APIs used by
`@stagehand/plan-engine`; they are development dependencies and are not bundled
into the Stagehand application.

| Package | Version | Licence | Copyright / attribution |
| --- | --- | --- | --- |
| `@types/node` | 26.6.5 | MIT | Copyright (c) Microsoft Corporation |
| `undici-types` | 8.9.0 | MIT | Copyright (c) Matteo Collina and Undici contributors |

### Licence review

`fast-uri` is licensed under BSD-3-Clause, not MIT. This dependency's licence
has been reviewed and accepted for use in Stagehand. Redistribution requires
retaining the source notice, reproducing the notice and disclaimer in binary
distributions, and not using contributor names to endorse derived products
without permission. The full licence text follows below.

### MIT licence

The MIT licence text below applies to each package identified as MIT above.

```text
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### BSD-3-Clause licence for `fast-uri`

```text
Copyright (c) 2011-2021, Gary Court until https://github.com/garycourt/uri-js/commit/a1acf730b4bba3f1097c9f52e7d9d3aba8cdcaae
Copyright (c) 2021-present The Fastify team <https://github.com/fastify/fastify#team>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * The names of any contributors may not be used to endorse or promote
      products derived from this software without specific prior written
      permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```
