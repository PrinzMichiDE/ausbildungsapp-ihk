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
] as const;

export type DocSlug = (typeof AVAILABLE_DOCS)[number]['slug'];

@Injectable()
export class DocsService {
  async getDoc(slug: DocSlug): Promise<{ title: string; html: string }> {
    const entry = AVAILABLE_DOCS.find((d) => d.slug === slug);
    if (!entry) throw new NotFoundException(`Doc "${slug}" not found`);

    const raw = await readFile(join(DOCS_DIR, entry.file), 'utf-8');
    const html = await marked.parse(raw);
    return { title: entry.title, html };
  }

  listDocs(): ReadonlyArray<{ slug: string; title: string }> {
    return AVAILABLE_DOCS.map((d) => ({ slug: d.slug, title: d.title }));
  }
}
