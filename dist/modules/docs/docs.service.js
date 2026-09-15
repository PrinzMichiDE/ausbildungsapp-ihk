var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { marked } from 'marked';
const DOCS_DIR = join(process.cwd());
const AVAILABLE_DOCS = [
    { slug: 'concept', file: 'concept.md', title: 'Softwarekonzept' },
    { slug: 'readme', file: 'README.md', title: 'README' },
    { slug: 'agents', file: 'AGENTS.md', title: 'AGENTS.md' },
    { slug: 'plan', file: 'plan.md', title: 'Plan' },
];
let DocsService = class DocsService {
    async getDoc(slug) {
        const entry = AVAILABLE_DOCS.find((d) => d.slug === slug);
        if (!entry)
            throw new NotFoundException(`Doc "${slug}" not found`);
        const raw = await readFile(join(DOCS_DIR, entry.file), 'utf-8');
        const html = await marked.parse(raw);
        return { title: entry.title, html };
    }
    listDocs() {
        return AVAILABLE_DOCS.map((d) => ({ slug: d.slug, title: d.title }));
    }
};
DocsService = __decorate([
    Injectable()
], DocsService);
export { DocsService };
//# sourceMappingURL=docs.service.js.map