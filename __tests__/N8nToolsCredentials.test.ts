import { N8nToolsApi } from '../credentials/N8nToolsApi.credentials';

describe('N8nToolsApi Credentials', () => {
	let credentials: N8nToolsApi;

	beforeEach(() => {
		credentials = new N8nToolsApi();
	});

	test('should have correct name', () => {
		expect(credentials.name).toBe('n8nToolsApi');
	});

	test('should have correct display name', () => {
		expect(credentials.displayName).toBe('N8N Tools BR API');
	});

	test('should have required properties', () => {
		expect(credentials.properties).toHaveLength(2);
		
		const apiUrlProperty = credentials.properties.find(p => p.name === 'apiUrl');
		expect(apiUrlProperty).toBeDefined();
		expect(apiUrlProperty?.required).toBe(true);
		expect(apiUrlProperty?.default).toBe('https://api.n8ntools.com.br');

		const apiKeyProperty = credentials.properties.find(p => p.name === 'apiKey');
		expect(apiKeyProperty).toBeDefined();
		expect(apiKeyProperty?.required).toBe(true);
		expect(apiKeyProperty?.typeOptions?.password).toBe(true);
	});

	test('should have authentication configuration', () => {
		expect(credentials.authenticate).toBeDefined();
		expect(credentials.authenticate.type).toBe('generic');
		expect(credentials.authenticate.properties.headers).toBeDefined();
		expect(credentials.authenticate.properties.headers['Authorization']).toBe('=Bearer {{$credentials.apiKey}}');
	});

	test('should have test configuration', () => {
		expect(credentials.test).toBeDefined();
		expect(credentials.test.request.url).toBe('/api/v1/auth/profile');
		expect(credentials.test.request.method).toBe('GET');
	});
});