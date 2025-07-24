import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import axios from 'axios';
import FormData from 'form-data';

export class N8nToolsPdf implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'N8N Tools PDF Generator',
		name: 'n8nToolsPdf',
		icon: 'file:n8ntools-pdf.svg',
		group: ['output'],
		version: 1,
		description: 'Generate PDFs using N8N Tools BR platform',
		defaults: {
			name: 'N8N Tools PDF',
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
						name: 'Generate from HTML',
						value: 'generateFromHtml',
						description: 'Generate PDF from HTML content',
						action: 'Generate PDF from HTML',
					},
					{
						name: 'Generate from Template',
						value: 'generateFromTemplate',
						description: 'Generate PDF from predefined template',
						action: 'Generate PDF from template',
					},
					{
						name: 'Generate from URL',
						value: 'generateFromUrl',
						description: 'Generate PDF from webpage URL',
						action: 'Generate PDF from URL',
					},
				],
				default: 'generateFromHtml',
			},
			// HTML Content Operation
			{
				displayName: 'HTML Content',
				name: 'htmlContent',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				displayOptions: {
					show: {
						operation: ['generateFromHtml'],
					},
				},
				default: '',
				description: 'HTML content to convert to PDF',
				required: true,
			},
			// Template Operation
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['generateFromTemplate'],
					},
				},
				default: '',
				description: 'ID of the template to use',
				required: true,
			},
			{
				displayName: 'Template Data',
				name: 'templateData',
				type: 'json',
				displayOptions: {
					show: {
						operation: ['generateFromTemplate'],
					},
				},
				default: '{}',
				description: 'JSON data to populate the template',
			},
			// URL Operation
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['generateFromUrl'],
					},
				},
				default: '',
				description: 'URL of the webpage to convert to PDF',
				required: true,
			},
			// Common options
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Filename',
						name: 'filename',
						type: 'string',
						default: 'document.pdf',
						description: 'Name of the generated PDF file',
					},
					{
						displayName: 'Format',
						name: 'format',
						type: 'options',
						options: [
							{ name: 'A4', value: 'A4' },
							{ name: 'A3', value: 'A3' },
							{ name: 'Letter', value: 'Letter' },
							{ name: 'Legal', value: 'Legal' },
						],
						default: 'A4',
						description: 'Paper format for the PDF',
					},
					{
						displayName: 'Orientation',
						name: 'orientation',
						type: 'options',
						options: [
							{ name: 'Portrait', value: 'portrait' },
							{ name: 'Landscape', value: 'landscape' },
						],
						default: 'portrait',
						description: 'Page orientation',
					},
					{
						displayName: 'Include Header',
						name: 'includeHeader',
						type: 'boolean',
						default: false,
						description: 'Whether to include header in the PDF',
					},
					{
						displayName: 'Include Footer',
						name: 'includeFooter',
						type: 'boolean',
						default: false,
						description: 'Whether to include footer in the PDF',
					},
					{
						displayName: 'Margin Top',
						name: 'marginTop',
						type: 'string',
						default: '1cm',
						description: 'Top margin (e.g., "1cm", "10px")',
					},
					{
						displayName: 'Margin Bottom',
						name: 'marginBottom',
						type: 'string',
						default: '1cm',
						description: 'Bottom margin (e.g., "1cm", "10px")',
					},
					{
						displayName: 'Margin Left',
						name: 'marginLeft',
						type: 'string',
						default: '1cm',
						description: 'Left margin (e.g., "1cm", "10px")',
					},
					{
						displayName: 'Margin Right',
						name: 'marginRight',
						type: 'string',
						default: '1cm',
						description: 'Right margin (e.g., "1cm", "10px")',
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
				const options = this.getNodeParameter('options', i, {}) as any;

				const requestData: any = {
					filename: options.filename || 'document.pdf',
					format: options.format || 'A4',
					orientation: options.orientation || 'portrait',
					includeHeader: options.includeHeader || false,
					includeFooter: options.includeFooter || false,
					margins: {
						top: options.marginTop || '1cm',
						bottom: options.marginBottom || '1cm',
						left: options.marginLeft || '1cm',
						right: options.marginRight || '1cm',
					},
				};

				let endpoint = '';

				switch (operation) {
					case 'generateFromHtml':
						const htmlContent = this.getNodeParameter('htmlContent', i) as string;
						requestData.html = htmlContent;
						endpoint = '/api/v1/pdf/generate/html';
						break;

					case 'generateFromTemplate':
						const templateId = this.getNodeParameter('templateId', i) as string;
						const templateData = this.getNodeParameter('templateData', i, '{}') as string;
						requestData.templateId = templateId;
						try {
							requestData.data = JSON.parse(templateData);
						} catch (error) {
							throw new NodeOperationError(this.getNode(), `Invalid JSON in template data: ${error.message}`);
						}
						endpoint = '/api/v1/pdf/generate/template';
						break;

					case 'generateFromUrl':
						const url = this.getNodeParameter('url', i) as string;
						requestData.url = url;
						endpoint = '/api/v1/pdf/generate/url';
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
						responseType: 'arraybuffer',
					}
				);

				// Convert response to binary data
				const binaryData = await this.helpers.prepareBinaryData(
					Buffer.from(response.data),
					requestData.filename,
					'application/pdf'
				);

				returnData.push({
					json: {
						success: true,
						filename: requestData.filename,
						size: response.data.byteLength,
						operation,
					},
					binary: {
						data: binaryData,
					},
				});
			} catch (error: unknown) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: errorMessage,
							success: false,
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), `PDF generation failed: ${errorMessage}`);
			}
		}

		return [returnData];
	}
}