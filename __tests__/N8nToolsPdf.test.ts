import { N8nToolsPdf } from '../nodes/N8nToolsPdf/N8nToolsPdf.node';

describe('N8nToolsPdf Node', () => {
	let node: N8nToolsPdf;

	beforeEach(() => {
		node = new N8nToolsPdf();
	});

	test('should have correct node description', () => {
		const description = node.description;
		
		expect(description.displayName).toBe('N8N Tools PDF Generator');
		expect(description.name).toBe('n8nToolsPdf');
		expect(description.group).toContain('output');
		expect(description.version).toBe(1);
		expect(description.inputs).toEqual(['main']);
		expect(description.outputs).toEqual(['main']);
	});

	test('should require n8nToolsApi credentials', () => {
		const credentials = node.description.credentials;
		expect(credentials).toHaveLength(1);
		expect(credentials?.[0].name).toBe('n8nToolsApi');
		expect(credentials?.[0].required).toBe(true);
	});

	test('should have operation property with correct options', () => {
		const operationProperty = node.description.properties.find(p => p.name === 'operation');
		expect(operationProperty).toBeDefined();
		expect(operationProperty?.type).toBe('options');
		expect(operationProperty?.options).toHaveLength(3);
		
		const operations = operationProperty?.options as any[];
		expect(operations.find(o => o.value === 'generateFromHtml')).toBeDefined();
		expect(operations.find(o => o.value === 'generateFromTemplate')).toBeDefined();
		expect(operations.find(o => o.value === 'generateFromUrl')).toBeDefined();
	});

	test('should have HTML content property for HTML operation', () => {
		const htmlProperty = node.description.properties.find(p => p.name === 'htmlContent');
		expect(htmlProperty).toBeDefined();
		expect(htmlProperty?.type).toBe('string');
		expect(htmlProperty?.required).toBe(true);
		expect(htmlProperty?.displayOptions?.show?.operation).toContain('generateFromHtml');
	});

	test('should have template properties for template operation', () => {
		const templateIdProperty = node.description.properties.find(p => p.name === 'templateId');
		expect(templateIdProperty).toBeDefined();
		expect(templateIdProperty?.displayOptions?.show?.operation).toContain('generateFromTemplate');
		
		const templateDataProperty = node.description.properties.find(p => p.name === 'templateData');
		expect(templateDataProperty).toBeDefined();
		expect(templateDataProperty?.type).toBe('json');
	});

	test('should have URL property for URL operation', () => {
		const urlProperty = node.description.properties.find(p => p.name === 'url');
		expect(urlProperty).toBeDefined();
		expect(urlProperty?.type).toBe('string');
		expect(urlProperty?.required).toBe(true);
		expect(urlProperty?.displayOptions?.show?.operation).toContain('generateFromUrl');
	});

	test('should have options collection with common PDF settings', () => {
		const optionsProperty = node.description.properties.find(p => p.name === 'options');
		expect(optionsProperty).toBeDefined();
		expect(optionsProperty?.type).toBe('collection');
		
		const options = optionsProperty?.options as any[];
		expect(options.find(o => o.name === 'filename')).toBeDefined();
		expect(options.find(o => o.name === 'format')).toBeDefined();
		expect(options.find(o => o.name === 'orientation')).toBeDefined();
		expect(options.find(o => o.name === 'marginTop')).toBeDefined();
	});
});