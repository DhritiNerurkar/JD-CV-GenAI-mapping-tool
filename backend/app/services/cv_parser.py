import PyPDF2
import io
from flask import current_app

def extract_text_from_pdf(pdf_file_storage):
    """
    Extracts text from an uploaded PDF file stream (FileStorage object).
    Returns extracted text or None if extraction fails.
    """
    text = ""
    try:
        # PyPDF2 reads from a file-like object
        pdf_reader = PyPDF2.PdfReader(pdf_file_storage.stream)
        num_pages = len(pdf_reader.pages)
        for page_num in range(num_pages):
            page = pdf_reader.pages[page_num]
            text += page.extract_text()
        current_app.logger.debug(f"Successfully parsed PDF: {pdf_file_storage.filename}, Pages: {num_pages}")
        return text if text else None # Return None if no text could be extracted
    except Exception as e:
        current_app.logger.error(f"Error parsing PDF {pdf_file_storage.filename}: {e}")
        return None