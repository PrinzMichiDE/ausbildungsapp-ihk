import type { Response } from 'express';
import { DocsService } from './docs.service.js';
export declare class DocsController {
    private readonly docsService;
    constructor(docsService: DocsService);
    docsIndex(): void;
    renderDoc(slug: string, res: Response): Promise<void>;
    private renderPage;
}
