import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import axios from 'axios';

export class N8nToolsScraper implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'N8N Tools Web Scraper',
		name: 'n8nToolsScraper',
		icon: 'file:n8ntools-scraper.svg',
		group: ['input'],
		version: 1,
		description: 'Scrape data from websites using N8N Tools BR platform',
		defaults: {
			name: 'N8N Tools Scraper',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'n8nToolsApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Scrape Single Page',
						value: 'scrapePage',
						description: 'Scrape data from a single webpage',
						action: 'Scrape single page',
					},
					{
						name: 'Scrape Multiple Pages',
						value: 'scrapeMultiple',
						description: 'Scrape data from multiple webpages',
						action: 'Scrape multiple pages',
					},
					{
						name: 'Monitor Page Changes',
						value: 'monitorPage',
						description: 'Monitor a webpage for changes',
						action: 'Monitor page changes',
					},
				],
				default: 'scrapePage',
			},
			// Single Page Operation
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['scrapePage', 'monitorPage'],
					},
				},
				default: '',
				description: 'URL of the webpage to scrape',
				required: true,
			},
			// Multiple Pages Operation
			{
				displayName: 'URLs',
				name: 'urls',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				displayOptions: {
					show: {
						operation: ['scrapeMultiple'],
					},
				},
				default: '',
				description: 'URLs to scrape (one per line)',
				required: true,
			},
			// Selectors
			{
				displayName: 'Selectors',
				name: 'selectors',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				description: 'CSS selectors to extract data',
				default: {},
				options: [
					{
						name: 'selector',
						displayName: 'Selector',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Name for this field in the output',
								required: true,
							},
							{
								displayName: 'CSS Selector',
								name: 'selector',
								type: 'string',
								default: '',
								description: 'CSS selector to extract data',
								required: true,
							},
							{
								displayName: 'Attribute',
								name: 'attribute',
								type: 'string',
								default: 'text',
								description: 'Attribute to extract (text, href, src, etc.)',
							},
							{
								displayName: 'Multiple',
								name: 'multiple',
								type: 'boolean',
								default: false,
								description: 'Whether to extract multiple elements',
							},
						],
					},
				],
			},
			// Options
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Wait for Selector',
						name: 'waitForSelector',
						type: 'string',
						default: '',
						description: 'CSS selector to wait for before scraping',
					},
					{
						displayName: 'Wait Time (seconds)',
						name: 'waitTime',
						type: 'number',
						default: 5,
						description: 'Time to wait before scraping',
					},
					{
						displayName: 'User Agent',
						name: 'userAgent',
						type: 'string',
						default: '',
						description: 'Custom user agent string',
					},
					{
						displayName: 'Enable JavaScript',
						name: 'enableJavaScript',
						type: 'boolean',
						default: true,
						description: 'Whether to enable JavaScript execution',
					},
					{
						displayName: 'Screenshot',
						name: 'screenshot',
						type: 'boolean',
						default: false,
						description: 'Take a screenshot of the page',
					},
					{
						displayName: 'Follow Redirects',
						name: 'followRedirects',
						type: 'boolean',
						default: true,
						description: 'Whether to follow HTTP redirects',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('n8nToolsApi');
		const baseUrl = credentials.apiUrl as string;
		const apiKey = credentials.apiKey as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const selectors = this.getNodeParameter('selectors', i, { selector: [] }) as any;
				const options = this.getNodeParameter('options', i, {}) as any;

				const requestData: any = {
					selectors: selectors.selector || [],
					options: {
						waitForSelector: options.waitForSelector || '',
						waitTime: options.waitTime || 5,
						userAgent: options.userAgent || '',
						enableJavaScript: options.enableJavaScript !== false,
						screenshot: options.screenshot || false,
						followRedirects: options.followRedirects !== false,
					},
				};

				let endpoint = '';

				switch (operation) {
					case 'scrapePage':
						const url = this.getNodeParameter('url', i) as string;
						requestData.url = url;
						endpoint = '/api/v1/scraper/scrape';
						break;

					case 'scrapeMultiple':
						const urls = this.getNodeParameter('urls', i) as string;
						requestData.urls = urls.split('\n').filter(url => url.trim());
						endpoint = '/api/v1/scraper/scrape/multiple';
						break;

					case 'monitorPage':
						const monitorUrl = this.getNodeParameter('url', i) as string;
						requestData.url = monitorUrl;
						endpoint = '/api/v1/scraper/monitor';
						break;

					default:
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
				}

				// Make API request
				const response = await axios.post(
					`${baseUrl}${endpoint}`,
					requestData,
					{
						headers: {
							'Authorization': `Bearer ${apiKey}`,
							'Content-Type': 'application/json',
						},
					}
				);

				const result = response.data;

				// Handle different response formats
				if (operation === 'scrapeMultiple' && Array.isArray(result.data)) {
					// Multiple pages - create one item per page
					result.data.forEach((pageData: any) => {
						returnData.push({
							json: {
								...pageData,
								success: true,
								operation,
							},
						});
					});
				} else {
					// Single page
					returnData.push({
						json: {
							...result,
							success: true,
							operation,
						},
					});
				}
			} catch (error: any) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							success: false,
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), `Web scraping failed: ${error.message}`);
			}
		}

		return [returnData];
	}
}