import PyPDF2
import docx


def extract_text_pdf(file):
    text = ""
    reader = PyPDF2.PdfReader(file)
    
    for page in reader.pages:
        text += page.extract_text()
        
    return  text
def extract_text_docx(file):
    text=""
    doc=docx.Document(file)
    
    for para in doc.paragraphs:
        
        text+=para.text + "\n"
        
    return text    
        