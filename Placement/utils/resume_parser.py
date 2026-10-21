import os
from pathlib import Path

def extract_text(file_path):
    """
    Extracts plain text from PDF, DOCX, or TXT files.
    """
    path = Path(file_path)
    if not path.exists():
        return ""

    suffix = path.suffix.lower()
    text = ""

    if suffix == ".pdf":
        try:
            import pypdf
            reader = pypdf.PdfReader(str(path))
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        except Exception as e:
            try:
                import pdfplumber
                with pdfplumber.open(str(path)) as pdf:
                    for page in pdf.pages:
                        text += (page.extract_text() or "") + "\n"
            except Exception as e2:
                print(f"Error reading PDF: {e}, {e2}")

    elif suffix in [".docx", ".doc"]:
        try:
            import docx
            doc = docx.Document(str(path))
            for para in doc.paragraphs:
                if para.text:
                    text += para.text + "\n"
        except Exception as e:
            print(f"Error reading DOCX: {e}")

    elif suffix in [".txt", ".md"]:
        try:
            with open(str(path), "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
        except Exception as e:
            print(f"Error reading text file: {e}")

    return text.strip()