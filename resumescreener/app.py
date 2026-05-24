import streamlit as st
from parser import  extract_text_pdf,extract_text_docx
from skills import clean_text
from scorer import match_score

st.title("AI Resume Screener")

job_description = st.text_area("Enter Job Description:")

file_upload = st.file_uploader("upload Resume",type=["pdf","docx"])

if st.button("Resume analayser"):
    if not file_upload:
        st.error("Please upload a resume")

    elif not job_description:
        st.error("Please enter job description")

    else:
        if file_upload:
            if file_upload.name.endswith(".pdf"):
            
                resume_text = extract_text_pdf(file_upload)
            else:
                resume_text = extract_text_docx(file_upload)
        
            clean_resume = clean_text(resume_text)
            clean_job = clean_text(job_description)
            score = match_score(clean_resume,clean_job)
        
            st.success(f"match score: {score}%")
        
        
            