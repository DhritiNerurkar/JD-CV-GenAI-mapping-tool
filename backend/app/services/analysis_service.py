from .cv_parser import extract_text_from_pdf
from .gemini_service import analyze_cv_jd
from flask import current_app

def process_cvs_jds(cv_files, jds_data):
    """
    Processes uploaded CV files against selected Job Descriptions.
    cv_files: List of FileStorage objects from Flask request.
    jds_data: List of JD dictionaries (loaded from storage).
    Returns a dictionary structured by JD ID, containing analysis results for each CV.
    """
    results_by_jd = {jd['id']: [] for jd in jds_data} # Initialize result structure

    if not cv_files:
        current_app.logger.warning("No CV files provided for analysis.")
        return results_by_jd
    if not jds_data:
        current_app.logger.warning("No JDs selected for analysis.")
        return {} # Or maybe return results_by_jd which would be empty


    current_app.logger.info(f"Starting analysis for {len(cv_files)} CV(s) against {len(jds_data)} JD(s).")

    for cv_file in cv_files:
        filename = cv_file.filename
        current_app.logger.info(f"Processing CV: {filename}")

        # 1. Parse CV
        cv_text = extract_text_from_pdf(cv_file)
        if not cv_text:
            current_app.logger.warning(f"Could not extract text from {filename}, skipping.")
            # Optionally add an error entry to results?
            continue # Skip to next CV

        # 2. Analyze against each selected JD
        for jd in jds_data:
            jd_id = jd['id']
            jd_title = jd.get('title', 'N/A')
            jd_text = jd.get('description', '') # Ensure description exists

            if not jd_text:
                current_app.logger.warning(f"JD '{jd_title}' (ID: {jd_id}) has no description, skipping analysis for this JD.")
                continue

            current_app.logger.debug(f"Analyzing {filename} against JD '{jd_title}' (ID: {jd_id})")

            analysis_result = analyze_cv_jd(cv_text, jd_text)

            if analysis_result:
                current_app.logger.info(f"Successfully analyzed {filename} against JD '{jd_title}'. Score: {analysis_result.get('overall_score')}")
                # Add filename to the result for frontend identification
                analysis_result['cv_filename'] = filename
                if jd_id in results_by_jd:
                     results_by_jd[jd_id].append(analysis_result)
                else:
                    # This case shouldn't happen with pre-initialization, but good practice
                    current_app.logger.warning(f"JD ID {jd_id} not found in results structure after analysis.")

            else:
                current_app.logger.warning(f"Failed to analyze {filename} against JD '{jd_title}'.")
                # Optionally add an error entry to results?
                # Example: results_by_jd[jd_id].append({'cv_filename': filename, 'error': 'Analysis failed'})


    # 3. Sort results within each JD by overall_score (descending)
    for jd_id in results_by_jd:
        # Handle potential errors where score might be missing or not an int
        results_by_jd[jd_id].sort(
            key=lambda x: x.get('overall_score', 0) if isinstance(x.get('overall_score'), int) else 0,
            reverse=True
        )

    current_app.logger.info("Analysis process completed.")
    return results_by_jd