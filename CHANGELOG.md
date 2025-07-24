# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-22

### Added

#### N8N Tools API Credentials
- Secure API authentication with N8N Tools BR platform
- Automatic credential validation
- Support for both production and development environments

#### PDF Generator Node
- **Generate from HTML**: Convert HTML content directly to PDF
- **Generate from Template**: Use predefined templates with dynamic data injection
- **Generate from URL**: Convert any webpage to PDF
- **Customization Options**:
  - Paper formats: A4, A3, Letter, Legal
  - Orientation: Portrait/Landscape
  - Custom margins
  - Header/Footer support
  - Custom filename generation

#### Web Scraper Node
- **Single Page Scraping**: Extract data from individual web pages
- **Multiple Page Scraping**: Batch process multiple URLs in parallel
- **Page Monitoring**: Monitor websites for changes (future feature)
- **Advanced CSS Selectors**: Extract text, attributes, or multiple elements
- **Browser Options**:
  - JavaScript execution control
  - Custom user agents
  - Wait conditions
  - Screenshot capture
  - Redirect handling
- **Data Extraction**: Flexible selector configuration for any website structure

#### Document Processor Node
- **Text Extraction**: Extract plain text from various document formats
- **Metadata Extraction**: Get document properties, author, creation date, etc.
- **Format Conversion**: Convert between PDF, DOCX, TXT, HTML, MD, RTF
- **Page Operations**:
  - Split documents into individual pages
  - Merge multiple documents
- **OCR Processing**: Extract text from images and scanned documents
  - Multi-language support (Portuguese, English, Spanish, French, German)
  - Auto-language detection
- **Multiple Input Sources**:
  - Binary data from previous nodes
  - Direct file URLs
  - Base64 encoded data
- **Advanced Features**:
  - Image extraction from documents
  - Table extraction and formatting
  - Password-protected document support
  - Format preservation options

### Technical Details

- **Node.js Compatibility**: >= 16.x
- **N8N Compatibility**: >= 1.0.0
- **TypeScript**: Full type safety and IntelliSense support
- **Error Handling**: Comprehensive error handling with detailed messages
- **Rate Limiting**: Automatic handling of API rate limits
- **Binary Data**: Full support for file uploads and downloads
- **Streaming**: Efficient handling of large documents

### Security

- API keys are securely stored using N8N's credential system
- All API communications use HTTPS
- No sensitive data is logged or cached
- Password-protected documents are handled securely

### Performance

- Optimized for large document processing
- Parallel processing for multiple URLs in web scraper
- Efficient memory usage for binary data handling
- Automatic cleanup of temporary files

### Documentation

- Comprehensive README with examples
- Inline documentation for all node properties
- TypeScript definitions for better IDE support
- Example workflows for common use cases

---

## Planned Features (Future Releases)

### Version 1.1.0
- **Webhook Support**: Real-time notifications for document processing
- **Batch Processing**: Enhanced batch operations for large datasets
- **Template Management**: Create and manage PDF templates directly in N8N
- **Advanced OCR**: Enhanced OCR with table recognition and layout preservation

### Version 1.2.0
- **AI Integration**: AI-powered document analysis and data extraction
- **Workflow Templates**: Pre-built workflows for common automation scenarios
- **Performance Monitoring**: Built-in performance metrics and optimization suggestions
- **Multi-format Export**: Export scraped data to Excel, CSV, JSON, XML

### Version 1.3.0
- **Real-time Monitoring**: Website change detection with instant notifications
- **Advanced Scheduling**: Cron-like scheduling for periodic tasks
- **Data Transformation**: Built-in data cleaning and transformation tools
- **Cloud Storage Integration**: Direct integration with AWS S3, Google Drive, Dropbox

---

**For support, feature requests, or bug reports, please visit:**
- 🐛 [GitHub Issues](https://github.com/n8ntools/n8n-nodes-n8ntools/issues)
- 📧 [Email Support](mailto:contato@n8ntools.com.br)
- 💬 [Discord Community](https://discord.gg/n8ntools)