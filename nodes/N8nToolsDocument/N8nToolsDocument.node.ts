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

function getMimeType(format: string): string {
	const mimeTypes: { [key: string]: string } = {
		pdf: 'application/pdf',
		docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		txt: 'text/plain',
		html: 'text/html',
		md: 'text/markdown',
		rtf: 'application/rtf',
	};
	return mimeTypes[format] || 'application/octet-stream';
}

export class N8nToolsDocument implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'N8N Tools Document Processor',
		name: 'n8nToolsDocument',
		icon: 'file:n8ntools-document.svg',
		group: ['transform'],
		version: 1,
		description: 'Process documents using N8N Tools BR platform',
		defaults: {
			name: 'N8N Tools Document',
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
						name: 'Extract Text',
						value: 'extractText',
						description: 'Extract text from document',
						action: 'Extract text from document',
					},
					{
						name: 'Extract Metadata',
						value: 'extractMetadata',
						description: 'Extract metadata from document',
						action: 'Extract metadata from document',
					},
					{
						name: 'Convert Format',
						value: 'convertFormat',
						description: 'Convert document to another format',
						action: 'Convert document format',
					},
					{
						name: 'Split Pages',
						value: 'splitPages',
						description: 'Split document into individual pages',
						action: 'Split document pages',
					},
					{
						name: 'Merge Documents',
						value: 'mergeDocuments',
						description: 'Merge multiple documents',
						action: 'Merge multiple documents',
					},
					{
						name: 'OCR Processing',
						value: 'ocrProcessing',
						description: 'Perform OCR on document',
						action: 'Perform OCR on document',
					},
				],
				default: 'extractText',
			},
			// Input Source
			{
				displayName: 'Input Source',
				name: 'inputSource',
				type: 'options',
				options: [
					{
						name: 'Binary Data',
						value: 'binaryData',
						description: 'Use binary data from previous node',
					},
					{
						name: 'File URL',
						value: 'fileUrl',
						description: 'Download file from URL',
					},
					{
						name: 'Base64',
						value: 'base64',
						description: 'Use base64 encoded data',
					},
				],
				default: 'binaryData',
			},
			// Binary Data Property
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				displayOptions: {
					show: {
						inputSource: ['binaryData'],
					},
				},
				description: 'Name of the binary property containing the file',
				required: true,
			},
			// File URL
			{
				displayName: 'File URL',
				name: 'fileUrl',
				type: 'string',
				displayOptions: {
					show: {
						inputSource: ['fileUrl'],
					},
				},
				default: '',
				description: 'URL of the file to process',
				required: true,
			},
			// Base64 Data
			{
				displayName: 'Base64 Data',
				name: 'base64Data',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				displayOptions: {
					show: {
						inputSource: ['base64'],
					},
				},
				default: '',
				description: 'Base64 encoded file data',
				required: true,
			},
			// Convert Format Options
			{
				displayName: 'Target Format',
				name: 'targetFormat',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['convertFormat'],
					},
				},
				options: [
					{ name: 'PDF', value: 'pdf' },
					{ name: 'DOCX', value: 'docx' },
					{ name: 'TXT', value: 'txt' },
					{ name: 'HTML', value: 'html' },
					{ name: 'MD', value: 'md' },
					{ name: 'RTF', value: 'rtf' },
				],
				default: 'pdf',
				description: 'Format to convert the document to',
				required: true,
			},
			// Split Pages Options
			{
				displayName: 'Page Range',
				name: 'pageRange',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['splitPages'],
					},
				},
				default: '',
				description: 'Page range to split (e.g., "1-5" or "all")',
				placeholder: 'all',
			},
			// OCR Options
			{
				displayName: 'OCR Language',
				name: 'ocrLanguage',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['ocrProcessing'],
					},
				},
				options: [
					{ name: 'Portuguese', value: 'por' },
					{ name: 'English', value: 'eng' },
					{ name: 'Spanish', value: 'spa' },
					{ name: 'French', value: 'fra' },
					{ name: 'German', value: 'deu' },
					{ name: 'Auto Detect', value: 'auto' },
				],
				default: 'por',
				description: 'Language for OCR processing',
			},
			// Advanced Options
			{
				displayName: 'Advanced Options',
				name: 'advancedOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Extract Images',
						name: 'extractImages',
						type: 'boolean',
						default: false,
						description: 'Extract images from document',
					},
					{
						displayName: 'Extract Tables',
						name: 'extractTables',
						type: 'boolean',
						default: false,
						description: 'Extract tables from document',
					},
					{
						displayName: 'Preserve Formatting',
						name: 'preserveFormatting',
						type: 'boolean',
						default: true,
						description: 'Preserve original formatting',
					},
					{
						displayName: 'Password',
						name: 'password',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						description: 'Password for protected documents',
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
				const inputSource = this.getNodeParameter('inputSource', i) as string;
				const advancedOptions = this.getNodeParameter('advancedOptions', i, {}) as any;

				// Prepare form data
				const formData = new FormData();
				formData.append('operation', operation);

				// Handle file input
				let fileBuffer: Buffer;
				let filename = 'document';

				switch (inputSource) {
					case 'binaryData':
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const binaryData = items[i].binary?.[binaryPropertyName];
						if (!binaryData) {
							throw new NodeOperationError(this.getNode(), `No binary data found for property "${binaryPropertyName}"`);
						}
						fileBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
						filename = binaryData.fileName || 'document';
						break;

					case 'fileUrl':
						const fileUrl = this.getNodeParameter('fileUrl', i) as string;
						const urlResponse = await axios.get(fileUrl, { responseType: 'arraybuffer' });
						fileBuffer = Buffer.from(urlResponse.data);
						filename = fileUrl.split('/').pop() || 'document';
						break;

					case 'base64':
						const base64Data = this.getNodeParameter('base64Data', i) as string;
						fileBuffer = Buffer.from(base64Data, 'base64');
						filename = 'document';
						break;

					default:
						throw new NodeOperationError(this.getNode(), `Unknown input source: ${inputSource}`);
				}

				formData.append('file', fileBuffer, filename);

				// Add operation-specific parameters
				switch (operation) {
					case 'convertFormat':
						const targetFormat = this.getNodeParameter('targetFormat', i) as string;
						formData.append('targetFormat', targetFormat);
						break;

					case 'splitPages':
						const pageRange = this.getNodeParameter('pageRange', i, 'all') as string;
						formData.append('pageRange', pageRange);
						break;

					case 'ocrProcessing':
						const ocrLanguage = this.getNodeParameter('ocrLanguage', i) as string;
						formData.append('language', ocrLanguage);
						break;
				}

				// Add advanced options
				if (advancedOptions.extractImages) {
					formData.append('extractImages', 'true');
				}
				if (advancedOptions.extractTables) {
					formData.append('extractTables', 'true');
				}
				if (advancedOptions.preserveFormatting !== undefined) {
					formData.append('preserveFormatting', advancedOptions.preserveFormatting.toString());
				}
				if (advancedOptions.password) {
					formData.append('password', advancedOptions.password);
				}

				// Make API request
				const response = await axios.post(
					`${baseUrl}/api/v1/documents/process`,
					formData,
					{
						headers: {
							'Authorization': `Bearer ${apiKey}`,
							...formData.getHeaders(),
						},
						responseType: operation === 'convertFormat' || operation === 'splitPages' ? 'arraybuffer' : 'json',
					}
				);

				if (operation === 'convertFormat') {
					// Return converted file as binary data
					const targetFormat = this.getNodeParameter('targetFormat', i) as string;
					const convertedFilename = filename.replace(/\.[^/.]+$/, `.${targetFormat}`);
					
					const binaryData = await this.helpers.prepareBinaryData(
						Buffer.from(response.data),
						convertedFilename,
						getMimeType(targetFormat)
					);

					returnData.push({
						json: {
							success: true,
							operation,
							originalFilename: filename,
							convertedFilename,
							targetFormat,
						},
						binary: {
							data: binaryData,
						},
					});
				} else if (operation === 'splitPages') {
					// Handle split pages result - could be multiple files
					const binaryData = await this.helpers.prepareBinaryData(
						Buffer.from(response.data),
						`${filename}_pages.zip`,
						'application/zip'
					);

					returnData.push({
						json: {
							success: true,
							operation,
							originalFilename: filename,
							outputFilename: `${filename}_pages.zip`,
						},
						binary: {
							data: binaryData,
						},
					});
				} else {
					// Return JSON result
					const result = response.data;
					returnData.push({
						json: {
							...result,
							success: true,
							operation,
							originalFilename: filename,
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
				throw new NodeOperationError(this.getNode(), `Document processing failed: ${error.message}`);
			}
		}

		return [returnData];
	}

}