# N8N Tools - Custom N8N Nodes

[![npm version](https://badge.fury.io/js/n8n-nodes-n8ntools.svg)](https://badge.fury.io/js/n8n-nodes-n8ntools)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Custom N8N nodes for integrating with the N8N Tools platform, providing powerful automation capabilities for PDF generation, web scraping, and document processing.

## Features

### 🔐 N8N Tools API Credentials
- Secure API authentication with your N8N Tools account
- Automatic token management and validation

### 📄 PDF Generator Node
- **Generate from HTML**: Convert HTML content to PDF
- **Generate from Template**: Use predefined templates with dynamic data
- **Generate from URL**: Convert web pages to PDF
- **Customizable Options**: Paper format, orientation, margins, headers/footers

### 🕷️ Web Scraper Node
- **Single Page Scraping**: Extract data from individual web pages
- **Multiple Page Scraping**: Batch process multiple URLs
- **Page Monitoring**: Monitor websites for changes
- **Advanced Selectors**: CSS selectors with attribute extraction
- **JavaScript Support**: Handle dynamic content
- **Screenshot Capture**: Optional page screenshots

### 📋 Document Processor Node
- **Text Extraction**: Extract text from various document formats
- **Metadata Extraction**: Get document properties and information
- **Format Conversion**: Convert between PDF, DOCX, TXT, HTML, MD, RTF
- **Page Splitting**: Split documents into individual pages
- **Document Merging**: Combine multiple documents
- **OCR Processing**: Extract text from images and scanned documents
- **Multiple Input Sources**: Binary data, URLs, or base64 encoded files

## Installation

You can install this package directly in your N8N instance:

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes** in your N8N interface
2. Click **Install a community node**
3. Enter `n8n-nodes-n8ntools`
4. Click **Install**

### Manual Installation

```bash
# In your N8N installation directory
npm install n8n-nodes-n8ntools

# Restart N8N
npm restart n8n
```

### Docker

```dockerfile
FROM n8nio/n8n:latest
USER root
RUN npm install -g n8n-nodes-n8ntools
USER node
```

## Setup

### 1. Get Your API Key

1. Sign up for a free account at [N8N Tools](https://n8ntools.com.br)
2. Go to your dashboard and navigate to **API Keys**
3. Generate a new API key for N8N integration

### 2. Configure Credentials

1. In N8N, go to **Credentials**
2. Click **Create New Credential**
3. Search for "N8N Tools API"
4. Enter your:
   - **API URL**: `https://api.n8ntools.com.br` (or your self-hosted instance)
   - **API Key**: Your generated API key
5. Click **Save** and test the connection

## Usage Examples

### PDF Generation Workflow

```
[Trigger] → [Data Source] → [N8N Tools PDF] → [Save to Drive]
```

**Example Configuration:**
- **Operation**: Generate from Template
- **Template ID**: `invoice-template`
- **Template Data**: `{"customer": "John Doe", "amount": 1500.00}`
- **Format**: A4
- **Filename**: `invoice-{{customer}}.pdf`

### Web Scraping Workflow

```
[Schedule Trigger] → [N8N Tools Scraper] → [Process Data] → [Database]
```

**Example Configuration:**
- **Operation**: Scrape Single Page
- **URL**: `https://example.com/products`
- **Selectors**:
  - Name: `title`, Selector: `h2.product-title`, Attribute: `text`
  - Name: `price`, Selector: `.price`, Attribute: `text`
  - Name: `link`, Selector: `a.product-link`, Attribute: `href`

### Document Processing Workflow

```
[File Trigger] → [N8N Tools Document] → [Extract Data] → [Email]
```

**Example Configuration:**
- **Operation**: Extract Text
- **Input Source**: Binary Data
- **Binary Property**: `data`
- **Advanced Options**:
  - Extract Images: ✓
  - Extract Tables: ✓

## Supported File Formats

### PDF Generator
- **Output**: PDF
- **Input**: HTML, Templates, URLs

### Web Scraper
- **Output**: JSON data
- **Input**: Any web URL
- **Optional**: Screenshot (PNG)

### Document Processor
- **Input Formats**: PDF, DOCX, DOC, TXT, RTF, HTML, XML
- **Output Formats**: PDF, DOCX, TXT, HTML, MD, RTF
- **OCR Languages**: Portuguese, English, Spanish, French, German, Auto-detect

## Error Handling

All nodes support N8N's built-in error handling:

- **Continue on Fail**: Process remaining items even if one fails
- **Retry on Fail**: Automatic retry with exponential backoff
- **Error Workflows**: Trigger separate workflows on errors

## Rate Limits

API rate limits depend on your N8N Tools subscription plan:

- **Free Plan**: 100 requests/month
- **Pro Plan**: 10,000 requests/month
- **Enterprise Plan**: Unlimited requests

Rate limit information is included in response headers and node output.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting PRs.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/n8ntools/n8n-nodes-n8ntools.git
cd n8n-nodes-n8ntools

# Install dependencies
npm install

# Build the project
npm run build

# Run linting
npm run lint

# Run tests
npm test
```

## Support

- 📧 **Email**: contato@n8ntools.com.br
- 💬 **Discord**: [Join our community](https://discord.gg/n8ntools)
- 📖 **Documentation**: [docs.n8ntools.com.br](https://docs.n8ntools.com.br)
- 🐛 **Issues**: [GitHub Issues](https://github.com/n8ntools/n8n-nodes-n8ntools/issues)

## License

MIT © N8N Tools

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

**Made with ❤️ by the N8N Tools team**
