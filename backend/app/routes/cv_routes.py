from flask import Blueprint, request, jsonify, current_app
from app.services.analysis_service import process_cvs_jds

bp = Blueprint('cv', __name__)

@bp.route('/analyze', methods=['POST'])
def analyze_cvs():
    if 'cv_files' not in request.files:
        return jsonify({"error": "No CV files part in the request"}), 400

    cv_files = request.files.getlist('cv_files') # Get list of files
    # Get JD IDs from form data (React FormData usually sends lists this way)
    jd_ids = request.form.getlist('jd_ids')

    if not cv_files or all(f.filename == '' for f in cv_files):
        return jsonify({"error": "No selected CV files"}), 400

    if not jd_ids:
        return jsonify({"error": "No Job Description IDs provided"}), 400

    current_app.logger.info(f"Received {len(cv_files)} CV(s) and {len(jd_ids)} JD ID(s) for analysis.")

    # Filter JDs from storage based on provided IDs
    all_jds = current_app.load_jds()
    selected_jds = [jd for jd in all_jds if jd.get('id') in jd_ids]

    if not selected_jds:
         current_app.logger.warning(f"None of the provided JD IDs {jd_ids} were found in storage.")
         return jsonify({"error": "Provided JD IDs not found"}), 404

    # Call the analysis service (this can take a long time)
    try:
        analysis_results = process_cvs_jds(cv_files, selected_jds)
        current_app.logger.info("Analysis successful. Returning results.")
        return jsonify(analysis_results), 200
    except Exception as e:
        # Catch unexpected errors during the whole process
        current_app.logger.error(f"Unexpected error during analysis: {e}", exc_info=True)
        return jsonify({"error": "An internal server error occurred during analysis."}), 500