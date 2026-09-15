var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Param, Res, Redirect } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProduces } from '@nestjs/swagger';
import { DocsService } from './docs.service.js';
let DocsController = class DocsController {
    docsService;
    constructor(docsService) {
        this.docsService = docsService;
    }
    docsIndex() { }
    async renderDoc(slug, res) {
        const docs = this.docsService.listDocs();
        const current = docs.find((d) => d.slug === slug);
        if (!current) {
            res.status(404).send(this.renderPage('404', '<p>Dokument nicht gefunden.</p>', docs, slug));
            return;
        }
        const { title, html } = await this.docsService.getDoc(slug);
        res.send(this.renderPage(title, html, docs, slug));
    }
    renderPage(title, bodyHtml, docs, activeSlug) {
        const nav = docs
            .map((d) => `<li><a href="/docs/${d.slug}" class="${d.slug === activeSlug ? 'active' : ''}">${d.title}</a></li>`)
            .join('\n        ');
        return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} – NextGen IT-Ausbildung</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; min-height: 100vh; color: #1a1a1a; background: #fff; }
    nav { width: 240px; background: #f5f5f5; border-right: 1px solid #e0e0e0; padding: 24px 16px; flex-shrink: 0; }
    nav h2 { font-size: 14px; text-transform: uppercase; letter-spacing: .05em; color: #666; margin-bottom: 12px; }
    nav ul { list-style: none; }
    nav li a { display: block; padding: 8px 12px; border-radius: 6px; text-decoration: none; color: #333; font-size: 14px; transition: background .15s; }
    nav li a:hover { background: #e8e8e8; }
    nav li a.active { background: #0055ff; color: #fff; }
    main { flex: 1; max-width: 820px; padding: 40px 48px; line-height: 1.7; }
    h1 { font-size: 28px; margin-bottom: 8px; }
    h2 { font-size: 22px; margin-top: 32px; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 6px; }
    h3 { font-size: 18px; margin-top: 24px; margin-bottom: 6px; }
    p { margin-bottom: 12px; }
    a { color: #0055ff; }
    pre { background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 6px; padding: 16px; overflow-x: auto; font-size: 13px; margin-bottom: 16px; }
    code { font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace; font-size: 13px; }
    :not(pre) > code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background: #f5f5f5; font-weight: 600; }
    blockquote { border-left: 4px solid #0055ff; padding: 8px 16px; margin-bottom: 12px; color: #555; background: #f9f9ff; }
    hr { border: none; border-top: 1px solid #eee; margin: 24px 0; }
    ul, ol { padding-left: 24px; margin-bottom: 12px; }
    li { margin-bottom: 4px; }
    @media (max-width: 768px) { body { flex-direction: column; } nav { width: 100%; border-right: none; border-bottom: 1px solid #e0e0e0; padding: 16px; } main { padding: 24px 16px; } }
  </style>
</head>
<body>
  <nav>
    <h2>Dokumentation</h2>
    <ul>
        ${nav}
    </ul>
  </nav>
  <main>
    ${bodyHtml}
  </main>
</body>
</html>`;
    }
};
__decorate([
    Get(),
    Redirect('/docs/concept'),
    ApiOperation({ summary: 'Software-Dokumentation (Weiterleitung auf Konzept)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DocsController.prototype, "docsIndex", null);
__decorate([
    Get(':slug'),
    ApiOperation({ summary: 'Markdown-Dokument rendern' }),
    ApiProduces('text/html'),
    __param(0, Param('slug')),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DocsController.prototype, "renderDoc", null);
DocsController = __decorate([
    ApiTags('Docs'),
    Controller('docs'),
    __metadata("design:paramtypes", [DocsService])
], DocsController);
export { DocsController };
//# sourceMappingURL=docs.controller.js.map