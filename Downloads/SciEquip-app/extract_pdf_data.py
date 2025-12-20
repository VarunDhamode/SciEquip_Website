import PyPDF2

def extract_text_from_pdf(pdf_path, output_path):
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print("Success")
    except Exception as e:
        print(f"Error: {e}")

extract_text_from_pdf('scientific_products_with_parameters.pdf', 'extracted_text.txt')
