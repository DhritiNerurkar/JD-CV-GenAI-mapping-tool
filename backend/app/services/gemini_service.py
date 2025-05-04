import google.generativeai as genai
import json
from flask import current_app

BASE_PROMPT_TEMPLATE = """
Analyze the following CV text in the context of the provided Job Description (JD).
Provide a detailed analysis structured as a JSON object.

**JSON Structure Requirements:**
- `overall_score`: Integer score from 0 to 100 representing the overall relevance of the CV to the JD.
- `skills_match_score`: Integer score from 0 to 100 assessing how well the candidate's skills match the JD requirements.
- `experience_relevance_score`: Integer score from 0 to 100 evaluating the relevance of the candidate's work experience to the JD.
- `education_fit_score`: Integer score from 0 to 100 judging the alignment of the candidate's education with the JD preferences.
- `keyword_alignment_score`: Integer score from 0 to 100 based on the presence and relevance of keywords from the JD within the CV.
- `key_highlights`: A JSON list of strings containing specific phrases or accomplishments from the CV that are highly relevant to the JD (max 5 items).
- `skill_gaps`: A JSON list of strings identifying key skills or requirements mentioned in the JD that seem to be missing or underrepresented in the CV (max 5 items).
- `reasoning`: A brief text explanation (1-2 sentences) justifying the overall score.

**Job Description:**
{jd_text}
**CV Text:**
{cv_text}

**Analysis (JSON Object Only):**
"""

def get_gemini_model():
    """Initializes and returns the Gemini model."""
    api_key = current_app.config.get('GEMINI_API_KEY')
    if not api_key:
        current_app.logger.error("Gemini API Key not configured.")
        raise ValueError("Gemini API Key not configured.")

    genai.configure(api_key=api_key)

    model = genai.GenerativeModel(
        model_name='gemini-1.5-flash', # Or another suitable model
         generation_config={"response_mime_type": "application/json"} # Request JSON directly!
         )
    return model

def analyze_cv_jd(cv_text, jd_text):
    """
    Uses Gemini API to analyze CV against JD.
    Returns a dictionary with analysis results or None on failure.
    """
    if not cv_text or not jd_text:
        current_app.logger.warning("CV text or JD text is empty, skipping analysis.")
        return None

    model = get_gemini_model()
    prompt = BASE_PROMPT_TEMPLATE.format(jd_text=jd_text, cv_text=cv_text)

    try:
        current_app.logger.debug("Sending request to Gemini API...")
        response = model.generate_content(prompt)
        current_app.logger.debug("Received response from Gemini API.")

        # Attempt to parse the JSON response directly
        # The API might return it pre-parsed if response_mime_type works well,
        # or within response.text if not. Adjust based on actual API behavior.
        if response.parts:
            analysis_json_str = response.text # Access text if MIME type handled correctly
            analysis_result = json.loads(analysis_json_str)
            current_app.logger.debug(f"Successfully parsed Gemini JSON response.")

            # Basic validation (add more checks as needed)
            required_keys = ['overall_score', 'skills_match_score', 'experience_relevance_score',
                             'education_fit_score', 'keyword_alignment_score', 'key_highlights',
                             'skill_gaps', 'reasoning']
            if all(key in analysis_result for key in required_keys):
                 return analysis_result
            else:
                current_app.logger.error(f"Gemini response missing required keys. Response: {analysis_json_str}")
                return None

        else:
             current_app.logger.error(f"Gemini response was empty or invalid. Response: {response}")
             return None

    except json.JSONDecodeError as e:
        current_app.logger.error(f"Failed to decode Gemini JSON response: {e}. Response text: {response.text[:500]}...") # Log beginning of text
        return None
    except Exception as e:
        # Catch specific Gemini API errors if possible from the SDK documentation
        current_app.logger.error(f"An error occurred during Gemini API call: {e}")
        return None