declare const AVAILABLE_DOCS: readonly [{
    readonly slug: "concept";
    readonly file: "concept.md";
    readonly title: "Softwarekonzept";
}, {
    readonly slug: "readme";
    readonly file: "README.md";
    readonly title: "README";
}, {
    readonly slug: "agents";
    readonly file: "AGENTS.md";
    readonly title: "AGENTS.md";
}, {
    readonly slug: "plan";
    readonly file: "plan.md";
    readonly title: "Plan";
}];
export type DocSlug = (typeof AVAILABLE_DOCS)[number]['slug'];
export declare class DocsService {
    getDoc(slug: DocSlug): Promise<{
        title: string;
        html: string;
    }>;
    listDocs(): ReadonlyArray<{
        slug: string;
        title: string;
    }>;
}
export {};
